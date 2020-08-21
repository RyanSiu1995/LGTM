const { Capabilities, Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');

describe('content.js', function() {
  this.timeout(0);
  var driver;

  before(async () => {
    let chromeCapabilities = Capabilities.chrome();
    //setting chrome options to start the browser fully maximized
    let chromeOptions = {
      'args': ['no-sandbox', '--disable-dev-shm-usage', '--headless']
    };
    chromeCapabilities.set('goog:chromeOptions', chromeOptions);

    driver = new Builder().forBrowser("chrome").withCapabilities(chromeCapabilities).build()
    var username = process.env.USERNAME;
    var password = process.env.PASSWORD;
    if (!username || !password) {
      throw new Error("Username and password for test account does not exist");
    }
    await driver.get('https://github.com/login');
    await driver.findElement(By.css('#login_field')).sendKeys(username)
    await driver.findElement(By.css('#password')).sendKeys(password + Key.ENTER)
    await driver.wait(until.urlIs('https://github.com/'), 2000)
  })

  it('should fill the LGTM in PR page after pressing the approve', async () => {
    await driver.get('https://github.com/RyanSiu1995/LGTM/pull/1');
    let hyperlinks = await driver.findElements(By.css('.tabnav-tab.js-pjax-history-navigate'));
    let proms = hyperlinks.map((elem) => 
      elem.getAttribute('href')
    );
    let targetIndex = (await Promise.all(proms)).findIndex((e) => e === 'https://github.com/RyanSiu1995/LGTM/pull/1/files');
    // Load the script for testing
    script = fs.readFileSync(`${process.cwd()}/content.js`, 'utf-8')
    await driver.executeScript(script);
    // Add the timeout to let the script loaded
    await new Promise(r => setTimeout(r, 1000));

    // Test case
    await hyperlinks[targetIndex].click();
    await driver.wait(until.elementLocated(By.css('summary.btn.js-reviews-toggle')), 2000);
    await driver.findElement(By.css('summary.btn.js-reviews-toggle')).click();
    await driver.wait(until.elementLocated(By.name('pull_request_review[event]')), 2000);
    let radioButtons = await driver.findElements(By.name('pull_request_review[event]'));
    proms = radioButtons.map((elem) => 
      elem.getAttribute('value')
    );
    targetIndex = (await Promise.all(proms)).findIndex((e) => e === 'approve');
    await radioButtons[targetIndex].click();
    await new Promise(r => setTimeout(r, 1000));
    let comment = await driver.findElement(By.name('pull_request_review[body]')).getAttribute('value');
    assert.equal(comment, "LGTM");
  })

  after(async () => {
    console.log("Exiting the driver...")
    await driver.quit();
  })
})
