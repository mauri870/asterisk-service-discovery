const etcdjs = require('etcdjs')(process.env.ETCD_ADDRESS);
const logger = require('./logger');

var etcd = {};
etcd.asterisk_nodes = [];

etcd.syncNodes = function() {
    etcdjs.get('asterisk_nodes', { recursive: true }, function (err, result) {
        if (!!err) { 
            logger.error(err);
            return;
        }

        if (result && typeof(result.node.nodes) !== 'undefined') {
            etcd.asterisk_nodes = result.node.nodes.map(function (item) {
                return item.value;
            });
        } else {
            etcd.asterisk_nodes = [];
        }

        logger.info("Current available nodes", etcd.asterisk_nodes);
    })
};

etcd.watchNodes = function() {
    etcdjs.wait('asterisk_nodes', { recursive: true, ttl: 5 }, function onchange (err, result, next) {
        if (!!err && err !== undefined) { logger.error(err); }

        if (!!result) {
            logger.info('Node changed, updating internal list', { 
                node: result.node.value
            });
            etcd.syncNodes();
        }
        next(onchange);
    });
};

module.exports = etcd;