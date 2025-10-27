#!/bin/bash

POOL=de.ironfish.herominers.com:1145
WALLET=406c14bac8709d75045c175bee21a13216107fcb6d5be66e5580a3a1d3a80035.lolMinerWorker

./lolMiner --algo FISHHASH-TEST --pool $POOL --user $WALLET $@

