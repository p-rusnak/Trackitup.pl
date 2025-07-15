# Trackitup.pl

This repository contains a PIU score tracker. The `Frontend/src/consts` folder now includes two additional files describing badge and title requirements:

- **badges.js** – lists song specific badges such as *Drill*, *Gimmick*, *Half*, *Run* and *Twist Expert*. Clearing the listed chart with an SS grade awards the corresponding level. Finishing all ten levels in any category now unlocks a meta badge like `[Drill] Expert` or `[Twist] Expert`. Collecting level 10 in every category grants the `Specialist` badge.
- **titleRequirements.js** – defines titles earned for clearing a given number of songs within difficulty ranges (e.g. *Intermediate* and *Advanced* levels).

These constants are meant for future logic awarding badges when users submit scores.

Submitting a score now returns any newly earned badges or titles in the response. The front end displays an alert when new achievements are awarded.
