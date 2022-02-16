const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')();
var colors = require('colors');
let hotFix = 0;
const temp = 1;
let n = 1;


//Proxy.txt import 
var fs = require('fs');
var array = fs.readFileSync('proxy.txt').toString().split("\r\n");
for(i in array) {
    // console.log(array.length);
}

//Get link form user
async function link(){
  const link = prompt('Give Tellonym link: '.red);
  return link;
}

//Get message to send form user
async function message(){
  const message = prompt('Give ur message: '.green);
  return message;
}

 async function spam(tellLink,tellMessage,proxy) {

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            // '--proxy-server=proxy',
            
          ],
    });
     // Go into tellonym page
     const page = await browser.newPage();
     const navigationPromise = page.waitForNavigation(); 
     let getXpathOfRecordLabel;
     let getTheProperty;
     let startValue;
     try {
        await page.goto(tellLink)
        await navigationPromise;
        await page.waitForTimeout(1000);

        //Get starting number of tells sent 

        //get the xpath of the element
        getXpathOfRecordLabel = await page.$x('//*[@id="root"]/div/div/div[5]/div/div/div[1]/div[2]/div/div[3]/div/div/div[3]/div[2]/div[1]');

        //get the property of textContent
        getTheProperty = await getXpathOfRecordLabel[0].getProperty('textContent');

        //get the value
        startValue = getTheProperty._remoteObject.value;

      } catch (error) {
        console.error(error);
        return;
      }
    
     while(temp == 1){

         //Select textarea
         await page.waitForTimeout(500);
         await page.waitForSelector('textarea[name="tell"]');
         await page.click('textarea[name="tell"]');
         await navigationPromise;

         //Write tell message
         await page.keyboard.type(tellMessage + hotFix, {delay: 0});
         await page.waitForTimeout(2500);
         hotFix = hotFix + 1;
         await navigationPromise;
         await page.waitForTimeout(500);

         //Submit tell message
         await page.waitForSelector('button[type="submit"]');
         await page.click('button[type="submit"]');
         console.log('Tell submited successfully!'.green)
         console.log("Tells sent (potentially): ".yellow + hotFix)


         await navigationPromise;


         //Refresh page 
         await page.reload();
         await navigationPromise;
         await page.waitForTimeout(8000);

         //Check if tell was sent if yes then console.log 
            try {
              //get the xpath of the element
                let getXpathOfRecordLabelFinal = await page.$x('//*[@id="root"]/div/div/div[5]/div/div/div[1]/div[2]/div/div[3]/div/div/div[3]/div[2]/div[1]');

              //get the property of textContent
                let getThePropertyFinal = await getXpathOfRecordLabelFinal[0].getProperty('textContent');

              //get the value
                let value = getThePropertyFinal._remoteObject.value;

                let actuallSentTells = value - startValue; 

                console.log("Actuall tells sent: ".red + actuallSentTells)

              //Server cooldown bypass
                
                if (actuallSentTells == hotFix-n){
                  console.log("Server is on cooldown".cyan)
                  // console.log("Bypasing server cooldown, waiting 70 seconds".cyan)
                  n=n+1
                  console.log(n-1 + " raz/y wyjebalo serwer cooldown".cyan)
                  // await page.waitForTimeout(70000);
                }
                else{console.log("Server is not on cooldown :)".cyan)}

            } 
            
            //Potential getProperty bypass
            catch (error) {
              console.error("Who cares program is bulletproof ".underline.red + error.message + error.name);
              await browser.close();
              return;
              
            }
     }
}


(async () => {
    let tellLink = await link();
    let tellMessage = await message();
    let proxyNumber = 0;
    
    while(1==1){ 
      await spam(tellLink,tellMessage,array[proxyNumber]);
    }
    
    
})();
