<?php
declare(strict_types=1);
use PHPMailer\PHPMailer\PHPMailer;
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
function answer(int $code, array $data): never { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
set_exception_handler(function(Throwable $e): void { answer(503, ['ok'=>false,'message'=>'Der Versand ist gerade nicht möglich. Bitte schreibe an annalenakorb@googlemail.com. Deine Eingaben bleiben erhalten.']); });
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
if (!is_string($token) || !isset($_SESSION['token']) || !hash_equals($_SESSION['token'],$token) || time()-(int)($_SESSION['created']??0)>7200) answer(403,['ok'=>false,'message'=>'Das Formular war zu lange geöffnet. Bitte sende deine Nachricht erneut.']);
$fields=['name','email','message','interest','website'];
foreach($fields as $field) if(isset($_POST[$field])&&!is_string($_POST[$field])) answer(422,['ok'=>false,'message'=>'Bitte überprüfe deine Eingaben.']);
if (trim($_POST['website']??'')!=='') answer(422,['ok'=>false,'message'=>'Die Anfrage konnte nicht verarbeitet werden. Bitte nutze E-Mail.']);
$name=trim($_POST['name']??'');$email=trim($_POST['email']??'');$message=trim($_POST['message']??'');$interest=trim($_POST['interest']??'Kennenlernen');
if (strlen($name)<2 || strlen($name)>400 || strlen($email)>254 || !filter_var($email,FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n\x00]/',$email.$name) || strlen($message)<10 || strlen($message)>16000 || !preg_match('//u',$message.$name)) answer(422,['ok'=>false,'message'=>'Bitte prüfe Name, E-Mail-Adresse und Nachricht (mindestens 10 Zeichen).']);
if(!in_array($interest,['Kennenlernen','Basis','Intensiv','Premium','Frage'],true)) answer(422,['ok'=>false,'message'=>'Bitte wähle ein Angebot aus der Liste.']);
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
$mail->Subject='Neue Website-Anfrage: '.$interest;
$mail->Body="Unverbindliche Website-Anfrage\n\nName: $name\nE-Mail: $email\nInteresse: $interest\n\n$message\n\nEingang (UTC): ".gmdate('Y-m-d H:i:s');
$mail->send();
unset($_SESSION['token'],$_SESSION['created']);
answer(200,['ok'=>true,'message'=>'Danke für deine Nachricht. Sie wurde zum Versand angenommen. Ich melde mich per E-Mail bei dir.']);
