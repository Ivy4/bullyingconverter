#!/usr/bin/env node
var replace = require("replace");
var prompt = require("prompt");


var fs = require('fs');

var fileToConvert = '';

fs.readdirSync('toconvert/').forEach(file => {
  fileToConvert = file.slice(0, -4);
})



prompt.start();
prompt.get(['colNum'], function (err, result) {

  if(result.colNum === '1') {
fs.createReadStream('templates/responsive-onecolumn.asp').pipe(fs.createWriteStream(`converted/${fileToConvert}.asp`));
fs.createReadStream('templates/responsive-onecolumn.asp').pipe(fs.createWriteStream(`converted/${fileToConvert}.html`));
  } else if (result.colNum === '2') {
fs.createReadStream('templates/responsive-twocolumn.asp').pipe(fs.createWriteStream(`converted/${fileToConvert}.asp`));
fs.createReadStream('templates/responsive-twocolumn.asp').pipe(fs.createWriteStream(`converted/${fileToConvert}.html`));
  }

  if(result.colNum === '1' || result.colNum === '2') {
    var header = fs.readFileSync('templates/header.asp', 'utf8');
    var footer = fs.readFileSync('templates/footer.asp', 'utf8');
    var navHeader = fs.readFileSync('templates/page-header-nav.asp', 'utf8');
    var nav = fs.readFileSync('templates/nav.html', 'utf8');

    var regexCont = /(<div class=\"content\")[\s\S]*(<!-- end \.content --><\/div>)/;
    var cont = fs.readFileSync(`toconvert/${fileToConvert}.asp`, 'utf8')

    var origFileCont = cont.match(regexCont)[0];

    origFileCont = origFileCont.replace(/<div class=\"content\"(.|\n)*?>/, '');
    origFileCont = origFileCont.replace(/<!-- end \.content --><\/div>/, '');

    var regexTitle = /<title>.*<\/title>/;
    var origFileTitle = cont.match(regexTitle)[0];

    if(result.colNum === '2'){
      var origCurrIds = [];
      origCurrIds[0] = cont.match(/var currId.*?;/)[0];
      origCurrIds[1] = cont.match(/var showTree.*?;/)[0];
      if(cont.match(/var showTree2.*?;/)){
        origCurrIds[2] = cont.match(/var showTree2.*?;/)[0];
      }
    }


    //var regexBread = /<div class="breadcrumb">[\s\S]*<\/div>/;
    //var origFileBread = cont.match(regexBread)[0];


    var putContent = () => {
      replace({
        regex: "OMGCONTENT",
        replacement: origFileCont,
        paths: [`converted/${fileToConvert}.html`],
        recursive: true,
        silent: true,
      });

      replace({
        regex: "OMGCONTENT",
        replacement: origFileCont,
        paths: [`converted/${fileToConvert}.asp`],
        recursive: true,
        silent: true,
      });

      replace({
        regex: "<title>Template - National Bullying Prevention Center</title>",
        replacement: origFileTitle,
        paths: [`converted/${fileToConvert}.html`],
        recursive: true,
        silent: true,
      });

      replace({
        regex: "<title>Template - National Bullying Prevention Center</title>",
        replacement: origFileTitle,
        paths: [`converted/${fileToConvert}.asp`],
        recursive: true,
        silent: true,
      });

if(result.colNum === '2'){
      replace({
        regex: /var currId.*?;/,
        replacement: origCurrIds[0],
        paths: [`converted/${fileToConvert}.asp`],
        recursive: true,
        silent: true,
      });

      replace({
        regex: /var showTree.*?;/,
        replacement: origCurrIds[1],
        paths: [`converted/${fileToConvert}.asp`],
        recursive: true,
        silent: true,
      });
    if(cont.match(/var showTree2.*?;/)){
      replace({
        regex: /var showTree2.*?;/,
        replacement: origCurrIds[2],
        paths: [`converted/${fileToConvert}.asp`],
        recursive: true,
        silent: true,
      });
    }
}
      //replace({
      //  regex: '<div class="breadcrumb"> <a href="/bullying/">Home</a> /</div>',
      //  replacement: origFileBread,
      //  paths: [`converted/${fileToConvert}.html`],
      //  recursive: true,
       // silent: true,
     // });

     // replace({
     //   regex: '<div class="breadcrumb"> <a href="/bullying/">Home</a> /</div>',
    //    replacement: origFileBread,
      //  paths: [`converted/${fileToConvert}.asp`],
      //  recursive: true,
      //  silent: true,
     // });


      replace({
        regex: '<!--#include virtual="/bullying/templates/header.asp"-->',
        replacement: header,
        paths: [`converted/${fileToConvert}.html`],
        recursive: true,
        silent: true,
      });

      replace({
        regex: '<!--#include virtual="/bullying/templates/page-header-nav.asp"-->',
        replacement: navHeader,
        paths: [`converted/${fileToConvert}.html`],
        recursive: true,
        silent: true,
      });

      replace({
        regex: '<!--#include virtual="/bullying/templates/nav.html"--> ',
        replacement: nav,
        paths: [`converted/${fileToConvert}.html`],
        recursive: true,
        silent: true,
      });

      replace({
        regex: '<!--#include virtual="/bullying/templates/footer.asp"-->',
        replacement: footer,
        paths: [`converted/${fileToConvert}.html`],
        recursive: true,
        silent: true,
      });

      replace({
        regex: /<img.*? src="\//,
        replacement: '<img src="http://staging.pacer.org/',
        paths: [`converted/${fileToConvert}.html`],
        recursive: true,
        silent: true,
      })
    }


    setTimeout(putContent, 500);

  }
  else {
    console.log('other')
  }
});
