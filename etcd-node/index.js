const logger = require('./logger')
const etcd = require('./etcd')

// Retrieve the asterisk servers on startup
etcd.syncNodes()

// Pooling asterisk_servers for changes
logger.info('Start to pooling asterisk_servers');
etcd.watchNodes();



