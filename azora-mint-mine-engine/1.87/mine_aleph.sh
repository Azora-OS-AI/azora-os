#!/bin/bash

POOL=de.alephium.herominers.com:1199
WALLET=1Gm1TL5MvN672qudFpLe8JkSX55F1peXEqBxBLnNaUfHz.lolMinerWorker

./lolMiner --algo ALEPH --pool $POOL --user $WALLET $@

