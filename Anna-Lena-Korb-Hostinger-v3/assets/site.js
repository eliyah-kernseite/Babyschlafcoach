document.documentElement.classList.add('js');
if(/\/(index\.html)?$/.test(location.pathname)){
 const oldRoutes={'#preise':'preise.html','#kontakt':'kontakt.html','#termin':'kontakt.html','#ablauf':'schlafberatung.html'};
 if(oldRoutes[location.hash])location.replace(oldRoutes[location.hash]);
}
const menu=document.querySelector('.menu'),nav=document.querySelector('.nav-links');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Schließen':'Menü';nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus()}});
const dialog=document.querySelector('#intro-dialog');
if(dialog&&typeof dialog.showModal==='function'){
 let trigger;
 document.querySelectorAll('[data-intro]').forEach(link=>link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();trigger=link;if(menu?.getAttribute('aria-expanded')==='true'){menu.click();trigger=menu;}dialog.showModal();document.body.classList.add('dialog-open');dialog.querySelector('input[name=name]').focus();}));
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');trigger?.focus()});
}
for(const form of document.querySelectorAll('[data-contact]')){
 const status=form.querySelector('[role=status]'),button=form.querySelector('button[type=submit]');
 const selection=new URLSearchParams(location.search).get('paket');
 if(selection&&form.elements.interest.options&&[...form.elements.interest.options].some(o=>o.value===selection))form.elements.interest.value=selection;
 const buttonLabel=button.textContent;
 let token='';
 const getToken=async()=>{const r=await fetch('api/contact.php',{credentials:'same-origin',headers:{Accept:'application/json'}});if(!r.ok)throw Error('Das Formular ist gerade nicht erreichbar. Bitte schreibe mir direkt per E-Mail.');const data=await r.json();token=data.token;};
 form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;button.disabled=true;button.textContent='Wird gesendet …';status.textContent='Deine Nachricht wird übertragen.';
 try{if(!token)await getToken();const data=new FormData(form);if(form.hasAttribute('data-quick'))data.set('message','Ich möchte ein kostenloses Kennenlerngespräch vereinbaren.'+(data.get('message').trim()?'\n\n'+data.get('message').trim():''));data.set('token',token);const r=await fetch('api/contact.php',{method:'POST',body:data,credentials:'same-origin',headers:{Accept:'application/json'}});const result=await r.json();if(!r.ok||!result.ok)throw Error(result.message||'Der Versand ist fehlgeschlagen. Bitte schreibe an annalenakorb@googlemail.com.');form.reset();token='';status.textContent=result.message;status.focus();}
 catch(error){token='';status.textContent=error.message==='Failed to fetch'?'Die Verbindung wurde unterbrochen. Deine Eingaben bleiben erhalten. Bitte versuche es erneut oder schreibe per E-Mail.':error.message;}
 finally{button.disabled=false;button.textContent=buttonLabel;}});
}
