<?php
declare(strict_types=1);
// Nimmt die Terminanfrage aus kontakt.html entgegen und schickt sie per E-Mail an Anna-Lena.
// Der Browser holt zuerst per GET ein Formular-Token und sendet die Anfrage dann per POST.
use PHPMailer\PHPMailer\PHPMailer;
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
function answer(int $code, array $data): never { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
set_exception_handler(function(Throwable $e): void { error_log('contact.php: '.$e->getMessage()); answer(503, ['ok'=>false,'message'=>'Der Versand ist gerade nicht möglich.']); });
$cfg = require dirname(__DIR__).'/private/config.php';
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if (!in_array($method, ['GET','POST'], true)) { header('Allow: GET, POST'); answer(405,['ok'=>false,'message'=>'Diese Anfrage wird nicht unterstützt.']); }
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (($origin !== '' && !in_array($origin,$cfg['origins'],true)) || ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') answer(403,['ok'=>false,'message'=>'Bitte öffne das Formular direkt auf unserer Website.']);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0)>24000) answer(413,['ok'=>false,'message'=>'Die Nachricht ist zu lang. Bitte kürze sie.']);
ini_set('session.use_strict_mode','1');
ini_set('session.gc_maxlifetime','7200');
session_name('alk_contact');
session_set_cookie_params(['lifetime'=>0,'path'=>'/api/','secure'=>(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off'),'httponly'=>true,'samesite'=>'Strict']);
session_start();
if ($method==='GET') {
    $_SESSION['token']=bin2hex(random_bytes(32)); $_SESSION['created']=time();
    answer(200,['ok'=>true,'token'=>$_SESSION['token']]);
}
$token=$_POST['token']??'';
if (!is_string($token) || !isset($_SESSION['token']) || !hash_equals($_SESSION['token'],$token) || time()-(int)($_SESSION['created']??0)>7200) answer(403,['ok'=>false,'message'=>'Das Formular war zu lange geöffnet. Bitte lade die Seite neu und sende die Anfrage erneut.']);
foreach(['name','email','message','interest','format','proposals','website'] as $field) if(isset($_POST[$field])&&!is_string($_POST[$field])) answer(422,['ok'=>false,'message'=>'Bitte überprüfe deine Eingaben.']);
if (trim($_POST['website']??'')!=='') answer(422,['ok'=>false,'message'=>'Die Anfrage konnte nicht verarbeitet werden.']);

// Gleiche Angebote, Dauer und Gesprächszeiten wie assets/config.js.
$offers=['Kennenlernen'=>['Kostenloses Kennenlernen',0,20],'Sprechstunde'=>['Schlafsprechstunde',89,45],'Basis'=>['Basis',149,60],'Intensiv'=>['Intensiv',299,60],'Premium'=>['Premium',479,60]];
$hours=[1=>[1020,1140],2=>[1020,1140],3=>[1020,1140],4=>[1020,1140],5=>[1020,1140],6=>[540,780]];
$name=trim($_POST['name']??'');$email=trim($_POST['email']??'');$message=trim($_POST['message']??'');$interest=$_POST['interest']??'';$format=$_POST['format']??'';
if (mb_strlen($name)<2 || mb_strlen($name)>100 || strlen($email)>254 || !filter_var($email,FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n\x00]/',$email.$name) || mb_strlen($message)>1200 || !preg_match('//u',$message.$name)) answer(422,['ok'=>false,'message'=>'Bitte prüfe Name, E-Mail-Adresse und Nachricht.']);
if (!isset($offers[$interest]) || !in_array($format,['Zoom','Telefon'],true)) answer(422,['ok'=>false,'message'=>'Bitte wähle ein Angebot und ein Gesprächsformat aus der Liste.']);
[$offerName,$price,$minutes]=$offers[$interest];
$proposals=json_decode($_POST['proposals']??'',true);
$tz=new DateTimeZone('Europe/Berlin');
// Einen Tag Spielraum gegenueber dem Browser, damit eine Anfrage kurz vor Mitternacht nicht scheitert.
$min=(new DateTimeImmutable('today',$tz))->modify('+6 days')->format('Y-m-d');
$max=(new DateTimeImmutable('today',$tz))->modify('+91 days')->format('Y-m-d');
$days=['So.','Mo.','Di.','Mi.','Do.','Fr.','Sa.'];$lines=[];$seen=[];
if (!is_array($proposals) || !array_is_list($proposals) || count($proposals)<1 || count($proposals)>3) answer(422,['ok'=>false,'message'=>'Bitte wähle ein bis drei Wunschzeiten.']);
foreach($proposals as $i=>$p){
    $date=is_array($p)?($p['date']??null):null;$time=is_array($p)?($p['time']??null):null;
    $d=is_string($date)&&preg_match('/^\d{4}-\d{2}-\d{2}$/',$date)?DateTimeImmutable::createFromFormat('!Y-m-d',$date,$tz):false;
    $ok=$d&&$d->format('Y-m-d')===$date&&$date>=$min&&$date<=$max&&is_string($time)&&preg_match('/^(\d{2}):(\d{2})$/',$time,$m)&&!isset($seen[$date.$time]);
    $w=$ok?(int)$d->format('w'):0;$t=$ok?(int)$m[1]*60+(int)$m[2]:0;
    if(!$ok||!isset($hours[$w])||$t%30!==0||$t<$hours[$w][0]||$t+$minutes>$hours[$w][1]) answer(422,['ok'=>false,'message'=>'Bitte wähle gültige Wunschzeiten mit mindestens sieben Tagen Vorlauf.']);
    $seen[$date.$time]=true;$lines[]=($i+1).'. '.$days[$w].', '.$d->format('d.m.Y').', '.$time.' Uhr';
}

// Rate records contain no message content and no raw IP. Daily key rotates.
$private=dirname(__DIR__).'/private';
$saltFile=$private.'/rate-secret.php';
$sf=fopen($saltFile,'c+'); if(!$sf||!flock($sf,LOCK_EX)) throw new RuntimeException('Storage unavailable');
$secret=stream_get_contents($sf);if($secret===''){$secret='<?php exit; ?>'.bin2hex(random_bytes(32));fwrite($sf,$secret);fflush($sf);}flock($sf,LOCK_UN);fclose($sf);
$key=hash_hmac('sha256',($_SERVER['REMOTE_ADDR']??'unknown').'|'.gmdate('Y-m-d'),$secret);
$rateDir=$private.'/rates';if(!is_dir($rateDir)&&!mkdir($rateDir,0700,true)&&!is_dir($rateDir))throw new RuntimeException('Storage unavailable');
foreach(glob($rateDir.'/*.json')?:[] as $old)if(filemtime($old)<time()-86400)@unlink($old);
$rateFile=$rateDir.'/'.$key.'.json';$handle=fopen($rateFile,'c+');if(!$handle||!flock($handle,LOCK_EX))throw new RuntimeException('Storage unavailable');
$times=json_decode(stream_get_contents($handle),true);$times=is_array($times)?array_values(array_filter($times,fn($t)=>is_int($t)&&$t>time()-3600)):[];
if(count($times)>=5){flock($handle,LOCK_UN);fclose($handle);header('Retry-After: 3600');answer(429,['ok'=>false,'message'=>'Es wurden mehrere Anfragen gesendet. Bitte versuche es später erneut oder schreibe direkt per E-Mail.']);}
$times[]=time();ftruncate($handle,0);rewind($handle);fwrite($handle,json_encode($times));fflush($handle);flock($handle,LOCK_UN);fclose($handle);

require dirname(__DIR__).'/vendor/phpmailer/Exception.php';
require dirname(__DIR__).'/vendor/phpmailer/PHPMailer.php';
require dirname(__DIR__).'/vendor/phpmailer/SMTP.php';
$mail=new PHPMailer(true);$mail->CharSet='UTF-8';$mail->Timeout=20;
if($cfg['transport']==='smtp'){
    if($cfg['smtp_username']===''||$cfg['smtp_password']==='')throw new RuntimeException('SMTP not configured');
    $mail->isSMTP();$mail->Host=$cfg['smtp_host'];$mail->Port=(int)$cfg['smtp_port'];$mail->SMTPAuth=true;$mail->Username=$cfg['smtp_username'];$mail->Password=$cfg['smtp_password'];$mail->SMTPSecure=$cfg['smtp_security'];
}else{$mail->isMail();}
$mail->setFrom($cfg['from_email'],$cfg['from_name']);$mail->addAddress($cfg['recipient']);$mail->addReplyTo($email,$name);
$mail->Subject='Terminanfrage: '.$offerName.' von '.$name;
$mail->Body=implode("\n",array_merge([
    'Neue Terminanfrage über babyschlaf-coach.de','',
    'Angebot: '.$offerName.($price?" ($price Euro)":' (kostenlos)'),
    'Name: '.$name,'E-Mail: '.$email,'Gespräch: '.$format,'',
    'Wunschtermine (deutsche Ortszeit):'],$lines,[''],
    $message!==''?['Nachricht:',$message,'']:[],
    ['Mit "Antworten" schreibst du direkt an '.$email.'.','Eingang: '.(new DateTimeImmutable('now',$tz))->format('d.m.Y H:i').' Uhr']));
$mail->send();
unset($_SESSION['token'],$_SESSION['created']);
answer(200,['ok'=>true]);
