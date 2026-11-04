// Keyboard-only modal regression for FR opt-in. Not a screen-reader or WCAG audit.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const profiles=[{name:'desktop',options:{viewport:{width:1365,height:900}}},{name:'mobile',options:devices['iPhone 13']}];
const languages=['es','en','fr'];
mkdirSync('qa-reports',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report={scope:'keyboard_map_dialog_focus_and_escape',results:[]};
try{
 for(const profile of profiles){
  const context=await browser.newContext(profile.options);
  const page=await context.newPage();
  try{
   await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-montillana'));
   for(const language of languages){
    const errors=[];
    try{
     await page.locator('#language-select').selectOption(language);
     await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
     const trigger=page.locator('#detail-content .map-button').first();
     await trigger.waitFor({state:'visible'});
     await trigger.focus();
     if(!(await trigger.evaluate(el=>document.activeElement===el)))errors.push('Map trigger not focusable');
     await page.keyboard.press('Enter');
     const dialog=page.locator('#map-dialog');
     await dialog.waitFor({state:'visible'});
     if(!(await dialog.evaluate(el=>el.open)))errors.push('Map dialog did not open');
     const inside=await page.evaluate(()=>document.activeElement?.closest('dialog')?.id==='map-dialog');
     if(!inside)errors.push('Focus did not enter map dialog');
     // Chromium can place focus on BODY at the native dialog wrap boundary.
     // The top-layer modal still makes background content inert; verify wrap recovery
     // and reject focus on any interactive element outside the dialog.
     for(let n=0;n<4;n++){
      await page.keyboard.press('Tab');
      const focus=await page.evaluate(()=>{
       const el=document.activeElement;
       return {tag:el?.tagName||'',id:el?.id||'',
         inside:!!el?.closest('#map-dialog'),
         dialogOpen:document.querySelector('#map-dialog').open};
      });
      if(!focus.dialogOpen){errors.push('Map dialog closed unexpectedly at Tab '+(n+1));break;}
      if(!focus.inside){
       if(focus.tag!=='BODY'){
        errors.push('Tab moved focus to outside element '+focus.tag+'#'+focus.id+' at step '+(n+1));break;
       }
       await page.keyboard.press('Tab');
       if(!(await page.evaluate(()=>document.activeElement?.closest('#map-dialog')!==null))){
        errors.push('Focus did not return inside modal after native Tab wrap at step '+(n+1));break;
       }
      }
     }
     await page.keyboard.press('Escape');
     await dialog.waitFor({state:'hidden'});
     if(!(await trigger.evaluate(el=>document.activeElement===el)))errors.push('Focus not restored to trigger after Escape');
     // 'close' is dispatched asynchronously; wait for the app's cleanup listener.
     try{
      await page.waitForFunction(()=>!document.querySelector('#map-frame').hasAttribute('src'),null,{timeout:1500});
     }catch{
      errors.push('Map iframe source retained after closing');
     }
    }catch(e){errors.push('Interrupted: '+e.message);}
    report.results.push({profile:profile.name,language,status:errors.length?'FAIL':'PASS',errors});
   }
  }finally{await context.close();}
 }
}finally{await browser.close();}
writeFileSync('qa-reports/fr-keyboard-map-dialog.json',JSON.stringify(report,null,2)+'\n');
console.log('FR KEYBOARD MAP DIALOG '+JSON.stringify(report));
if(report.results.length!==6||report.results.some(r=>r.status==='FAIL'))process.exitCode=1;
