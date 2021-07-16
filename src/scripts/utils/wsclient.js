//less ie8
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return (this.match("^" + str) == str)
    }
}
window.WIS = function () {
    if (!window.console) window.console = { log: function () { } }
    function loger(level, prefix, msg) {
        if (WIS.Log > level)
            console.log("WIS." + prefix, msg)
    }
    function logInfo(prefix, msg) {
        loger(5, prefix, msg);
    }
    function logError(prefix, msg) {
        loger(10, prefix, msg);
    }
    function logWarn(prefix, msg) {
        loger(15, prefix, msg);
    }
    var mqttClient_ = null;
    var opt_ = {
    }

    function syncData(data) {
        if (!mqttClient_ || !mqttClient_.isConnected()) return;
        data.clientid = clientid_;
        data.msguuid = Paho.MQTT.NewGuid();
        data.createtime = (new Date).getTime();
        var message = new Paho.MQTT.Message(JSON.stringify(data));
        console.log(data);
        message.destinationName = opt_.room;
        message.qos = 0;
        message.retained = false;
        console.log(message)
        mqttClient_.send(message);
    }
    var clientid_ = null;
    function wsconnect() {
        if (!clientid_) {
            if (opt_.clientId) {
                clientid_ = opt_.clientId
            } else {
                clientid_ = "ws2-" + Paho.MQTT.NewGuid()
            }
        } else {
            try { if (opt_.onReconnect) opt_.onReconnect(); } catch (err) { logWarn("wsconnect",err) }
        }
        mqttClient_ = new Paho.MQTT.Client(opt_.dmsHost,opt_.useSSL?Number(3001):Number(3000), clientid_);
        mqttClient_.onConnectionLost = function (responseObject) {
            if (responseObject.errorCode !== 0) {
                if (mqttClient_ != null) {
                    try {
                        mqttClient_.disconnect()
                    } catch (err) {
                        console.log(err)
                    }
                    mqttClient_ = null
                    setTimeout(wsconnect, 100)
                }
            }
        };
        mqttClient_.onMessageArrived = function (message) {
            onMessage(message.destinationName, message.payloadString)
        }
        mqttClient_.connect({
            timeout: 10, // connect timeout
            //TODO
            //userName: opt_.pubKey,
            //password: opt_.subKey,
            useSSL:opt_.useSSL,
            keepAliveInterval: 60, // keepalive
            cleanSession: false, //
            onSuccess: function () {
                mqttClient_.subscribe(opt_.room, { qos: 1 });

                try { if (opt_.onConnect) opt_.onConnect(); } catch (err) { logInfo("mqttClient_.connect.onSuccess", err) }
            },
            onFailure: function (err) {
                try { if (opt_.onConnectClose) opt_.onConnectClose(); } catch (err) { logWarn("mqttClient_.connect.onFailure", err) }
                setTimeout(wsconnect, 1000)
            }
        });
    }
    function onMessage(room, msg) {
        try {
            logInfo("onMessage", msg);
            if (room == opt_.room) {
                var data = eval('(' + msg + ')');
                if (data.clientid == clientid_) {
                    return;
                }
                data.recvAt = new Date().getTime();
                actionQueue_.Push(data)
            } else {
                try {
                    msg = eval('(' + msg + ')');
                } catch (err) { }
                if (opt_.onCustomMessage != null) {
                    opt_.onCustomMessage(msg, room);
                }
            }
        } catch (err) {
            logWarn("onMessage", err);
        }
    }

    var actionQueue_ = new ActionQueue();
    function ActionQueue() {
        this.queue_ = [];
        this.acting = false;
    }
    ActionQueue.prototype.Push = function (message) {
        if (message != null) {
            this.queue_.push(message);
            this.actQueue();
        }
    }
    ActionQueue.prototype.Run = function () {
        setInterval(function () {
            opt_.currentTime = parseInt(opt_.currentTime) + 50;
            actionQueue_.actQueue();
        }, 50);
    }
    //接收消息
    ActionQueue.prototype.actQueue = function () {
        if (this.acting) return
        this.acting = true;
        while (this.queue_.length > 0) {
            var self = this;
            message = this.queue_.shift();
            var now = new Date().getTime();
            if (opt_.delay > 0 && (now - message.recvAt) < opt_.delay) {
                this.queue_.unshift(message);
                this.acting = false;
                return;
            }

            if (message.cmd == "move") {
                //TODO移动

            }else if (message.cmd == 'pipeichenggong') {

            }

        }
        this.acting = false;
    }
    return {
        Init: function (opt) {
            opt_.dmsHost = opt.dmsHost;

            opt_.useSSL = !!opt.useSSL;

            opt_.room = opt.room;

            opt_.onConnect = opt.onConnect
            opt_.onReconnect = opt.onReconnect
            opt_.onConnectClose = opt.onConnectClose
            opt_.preTime = new Date().getTime();
            opt_.clientId = opt.clientId ? opt.clientId : "";

            if (opt.delay > 0) {
                opt_.delay = opt.delay;
            }
            actionQueue_.Run();
            setTimeout(wsconnect, 100);
        },
        SyncData: function(data) {
            syncData(data);
        },
        Subscribe: function (room, qos) {
            qos = qos == undefined ? 1 : qos;
            mqttClient_.subscribe(room, { qos: qos });
        },
        Unsubscribe: function(room) {
            mqttClient_.unsubscribe(room);
        },
        GetTopic: function () {
            return opt_.room;
        }
    }
}();
function getQueryStr(str, url) {
    var LocString = String(url != undefined ? url : window.document.location.href);
    var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp;
    if (tmp = rs) return decodeURIComponent(tmp[2]);
    return "";
}
WIS.Log =  parseInt(getQueryStr("log"));
WIS.Log = isNaN(WIS.Log) ? 0 : WIS.Log;
