#!/bin/bash

POOL=de.karlsen.herominers.com:1195
WALLET=karlsen:qqu40xsxzxhude64mt55l4p5cavlpenfp8jf0vj7qf8fqmdtl57z2z9jeur29.lolMinerWorker

./lolMiner --algo KARLSEN --pool $POOL --user $WALLET $@

