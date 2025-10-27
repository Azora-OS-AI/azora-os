#!/bin/bash

POOL=pool.eu.woolypooly.com:3122
WALLET=1Koq8XCxs6draSogtVQitiNJ32zD7EQmqb.lolMinerWorker

./lolMiner --algo RADIANT --pool $POOL --user $WALLET $@

