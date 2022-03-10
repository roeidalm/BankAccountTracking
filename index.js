import { CompanyTypes, createScraper } from 'israeli-bank-scrapers';
import fs from "fs";
import json2xls from "json2xls";

function configuration(){
  return JSON.parse(fs.readFileSync('./credentials.json'));
}
function saveJsonToFile(data,filename){
  console.log(data)
  const jsonContent = JSON.stringify(data);

  fs.writeFile(filename, jsonContent, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
  
      console.log("The file was saved!");
  }); 

}

function convert(data,filename) {  
  var xls = json2xls(data);
  fs.writeFileSync(filename, xls, 'binary', (err) => {
     if (err) {
           console.log("writeFileSync :", err);
      }
    console.log( filename+" file is saved!");
 });
}

(async function() {
  try {
    const jsonData=configuration();
    console.log(jsonData)
    // read documentation below for available options
    const optionsLeumi = {
      companyId: CompanyTypes.leumi, 
      startDate: new Date('2020-05-01'),
      combineInstallments: false,
      showBrowser: true 
    };

    // read documentation below for information about credentials
    const credentialsLeumi = {
      username: jsonData.usernameLeumi,
      password: jsonData.passwordLeumi
    };

    const scraperLeumi = createScraper(optionsLeumi);
    const scrapeResultLeumi = await scraperLeumi.scrape(credentialsLeumi);

    if (scrapeResultLeumi.success) {
      scrapeResultLeumi.accounts.forEach((account) => {
        console.log(`found ${account.txns.length} transactions for account number ${account.accountNumber}`);
        saveJsonToFile(account,account.accountNumber+"leumiJsonData.json")
        convert(account.txns,account.accountNumber+"leumiData.xlsx")
      });
    }
    else {
      throw new Error(scrapeResultLeumi.errorType);
    }
    
    // read documentation below for available options
    const optionsMax = {
      companyId: CompanyTypes.max, 
      startDate: new Date('2020-05-01'),
      combineInstallments: false,
      showBrowser: true 
    };

    // read documentation below for information about credentials
    const credentialsMax = {
      username: jsonData.usernameMax,
      password: jsonData.passwordMax
    };

    const scraperMax = createScraper(optionsMax);
    const scrapeResultMax = await scraperMax.scrape(credentialsMax);

    if (scrapeResultMax.success) {
      scrapeResultMax.accounts.forEach((account) => {
        console.log(`found ${account.txns.length} transactions for account number ${account.accountNumber}`);
        saveJsonToFile(account,account.accountNumber+"maxJsonData.json")
        convert(account.txns,account.accountNumber+"maxData.xlsx")
      });
    }
    else {
      throw new Error(scrapeResultMax.errorType);
    }
    
  } catch(e) {
    console.error(`scraping failed for the following reason: ${e.message}`);
  }  
})();
