"use strict";
const puppeteer = require("puppeteer");
require("dotenv").config();

const Cfg = {
  name: process.env.user,
  nameSelector: "#loginInputSelector",
  pw: process.env.pass,
  pwSelector: "#pinInputSelector",
  loginSelector: "#buttonlogin",
  logoutSelector: "[id=logout]",
  fromDate: process.env.from,
  toDate: process.env.to,
  banking: {
    time: 'input[id="id-1615473160_searchPeriodRadio:1"]',
    fromDate: "input[name=transactionDate]",
    toDate: "input[name=toTransactionDate]",
    searchBtn: "button[id=searchbutton]",
    downloadCSV: "[title=CSV-Export]",
  },
  checking: {
    time: "input[value=DATE_RANGE]",
    fromDate: 'input[name="postingDate"]',
    toDate: 'input[name="toPostingDate"]',
    searchBtn: "button[id=searchbutton]",
    downloadCSV: "[title=CSV-Export]",
  },
};
var browser;
var page;
const BrowserInit = async () => {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: process.cwd() + `/download/${Cfg.name}/`,
  });
};

const BrowserLogin = async () => {
  await BrowserInit();
  await page.goto("https://dkb.de/banking/");
  await page.type(Cfg.nameSelector, Cfg.name);
  await page.type(Cfg.pwSelector, Cfg.pw);
  await Promise.all([
    page.click(Cfg.loginSelector),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]).then(console.log("please accept login (2FA)"));
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  console.log(`login successful as ${Cfg.name}`);
};

const DownloadAll = async () => {
  await page.goto("https://www.dkb.de/banking/finanzstatus/kontoumsaetze");

  var i = 0;
  var next = true;
  while (next) {
    await page.select('[name="slAllAccounts"]', i.toString()).then(() => {
      console.log(`Account: ${i}`);
    });

    if (page.url().includes("konto")) {
      await DownloadAccount(Cfg.banking, Cfg.fromDate, Cfg.toDate);
    } else {
      await DownloadAccount(Cfg.checking, Cfg.fromDate, Cfg.toDate);
    }

    next = (await page.$(`option[value="${i}"]`)) !== null ? true : false;
    i++;
  }
};

const DownloadAccount = async (focus, fromDate, toDate) => {
  try {
    await page.waitFor(1000);
    await page.click(focus.time);
    await page.$eval(
      focus.fromDate,
      (el, _fromDate) => (el.value = _fromDate),
      fromDate
    );
    await page.$eval(
      focus.toDate,
      (el, _toDate) => (el.value = _toDate),
      toDate
    );
    await page.click(focus.searchBtn);
    await page.waitFor(1000);
    await page.click(focus.downloadCSV);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const BrowserLogoutAndKill = async () => {
  await page.click(Cfg.logoutSelector);
  console.log(`logout successful as ${Cfg.name}`);
  await browser.close();
};

module.exports = {
  login: BrowserLogin,
  logout: BrowserLogoutAndKill,
  download: DownloadAll,
  downloadPath: process.cwd() + `/download/${Cfg.name}/`,
};
