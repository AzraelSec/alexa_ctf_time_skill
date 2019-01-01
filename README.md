# CTF Time Alexa Skill

[![Stars](https://img.shields.io/github/stars/AzraelSec/alexa_ctf_time_skill.svg?style=popout-square)](https://github.com/AzraelSec/alexa_ctf_time_skill)
[![Forks](https://img.shields.io/github/forks/AzraelSec/alexa_ctf_time_skill.svg?style=popout-square)](https://github.com/AzraelSec/alexa_ctf_time_skill)
[![Issues](https://img.shields.io/github/issues/AzraelSec/alexa_ctf_time_skill.svg?style=popout-square)](https://github.com/AzraelSec/alexa_ctf_time_skill)
[![License](https://img.shields.io/github/license/AzraelSec/alexa_ctf_time_skill.svg?style=popout-square)](https://github.com/AzraelSec/alexa_ctf_time_skill)
[![Dependencies](https://david-dm.org/AzraelSec/alexa_ctf_time_skill.svg)](https://github.com/AzraelSec/alexa_ctf_time_skill)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/azraelsec)


<div align="center">
    <img alt="Amazon Alexa Logo" src="https://static1.squarespace.com/static/52f8da70e4b05d1230c52a1d/t/599adb5546c3c47a3868e056/1503320934223/amazon_alexa">
</div>

## About
This skill implements a bridge between [C.T.F. Time](https://ctftime.org/)'s API and Amazon's Alexa assistant.

## Supported Commands
This is only the first release, so there are only few commands **_(IT/EN supported)_**:

- To request information about the **top 10** global ranking
  - *Alexa, launch C.T.F. Time*
  - *Alexa, which teams are on top of the charts*
  - *Alexa, who were the first ranked in 2014*
  - *Alexa, which were the top three teams in 2016*
- To ask for the **best team**
  - *Alexa, open C.T.F. Time*
  - *Alexa, who is the best*
  - *Alexa, in 2013 who was the best*
  - *Alexa, which was the best of 2015*
- To look for **upcoming C.T.F. events**
  - *Alexa, ask C.T.F. Time to show me the upcoming events*
  - *Alexa, ask C.T.F. Time which are the next seven events*

# Dependencies
These are the project dependencies:

- [ask-sdk](https://www.npmjs.com/package/ask-sdk) ^2.3.0
- [i18next](https://www.npmjs.com/package/i18next) ^12.1.0
- [i18next-sprintf-postprocessor](https://www.npmjs.com/package/i18next-sprintf-postprocessor) ^0.2.2
- [request](https://www.npmjs.com/package/request) ^2.88.0
- [ssml-builder](https://www.npmjs.com/package/ssml-builder) ^0.4.3

# Donation
If you like this skill or you like this project, you can give me a cup of coffee *:P*

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://paypal.me/azraelsec)