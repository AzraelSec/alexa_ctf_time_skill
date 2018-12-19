#` CTF Time Alexa Skill

[![](https://img.shields.io/github/issues/AzraelSec/alexa_ctf_time_skill.svg?style=popout-square)](https://github.com/AzraelSec/alexa_ctf_time_skill)
[![](https://img.shields.io/github/forks/AzraelSec/alexa_ctf_time_skill.svg?style=popout-square)](https://github.com/AzraelSec/alexa_ctf_time_skill)
[![](https://img.shields.io/github/stars/AzraelSec/alexa_ctf_time_skill.svg?style=popout-square)](https://github.com/AzraelSec/alexa_ctf_time_skill)
[![](https://img.shields.io/github/license/AzraelSec/alexa_ctf_time_skill.svg?style=popout-square)](https://github.com/AzraelSec/alexa_ctf_time_skill)


<center>
<img alt="Amazon Alexa Logo" src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/avs/docs/ux/branding/mark2._TTH_.png">
</center>

## Description
This skill implements a bridge between CTF Time's API and Amazon's Alexa assistant.

## Supported Commands
This is only the first release, so there are only few commands:

- To request the **top 10** global ranking
  - *Alexa, chiedi a ctf time chi sono i migliori*
  - *I dieci migliori team sono: XXX con YYY punti, XXX con YYY punti, ...*
- To request *{n}* teams from the **top 10** global ranking
  - *Alexa, chiedi a ctf time chi sono i migliori tre team*
  - *I tre migliori team del 2018 sono: XXX con YYY punti, ...*
- To request *{n}* (__not mandatory__) teams from the **top 10** global ranking referred to a specific year
  - *Alexa, chiedi a ctf time chi erano i migliori (tre) team del 2014*
  - *I migliori (tre) team del 2014 sono: XXX con YYY punti, ...*