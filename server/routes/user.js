let express = require('express');
let msRestAzure = require('ms-rest-azure');
let azureGraph = require('azure-graph');
let usersvc = require('../services/user');

function UserRoutes() {
    let router = express.Router();

    router.post('/authenticate', function (req, res) {
        let account = {
            username: req.body.username,
            password: req.body.password
        }

        msRestAzure.loginWithUsernamePassword(process.env.ADUSERNAME, process.env.ADPASSWORD, {
            tokenAudience: 'graph', domain: process.env.TENANTID
        }, function (err, credentials, subscriptions) {
            if (err) res.status(500).json({ success: false, details: err });
            var client = new azureGraph(credentials, process.env.TENANTID);
            if (client) {
                client.users.list(function (err1, users) {
                    if (err1) res.status(500).json({ success: false, details: err1 });
                    var acct = users.find(obj => obj.mail === account.username);
                    if (acct) {
                        // if email exist

                        // todo: check database for credentials

                        // get account groups
                        client.users.getMemberGroups(acct.objectId, false, function (err2, groups) {
                            if (err2) res.status(500).json({ success: false, details: err2 });

                            getGroupDetails(groups, 0, [], client, res);
                        });
                    } else {
                        res.status(404).json({ success: false, details: "User not found" });
                    }
                });
            } else {
                res.status(404).json({ success: false, details: "Failed to connect to microsoft azure active directory" });
            }
        });
    });

    var getGroupDetails = function (groups, idx, currList, client, res) {
        if (idx < groups.length) {
            client.groups.get(groups[idx], function (err, group) {
                if (err) res.status(500).json({ success: false, details: "Error in getting group info" });
                currList.push(group);
                getGroupDetails(groups, ++idx, currList, client, res);
            });
        } else {
            res.status(200).json({
                success: true,
                groups: currList
            });
        }
    }

    router.get('/getwidgets', function (req, res) {
        usersvc.getUserWidgets([req.query.userid || 0], function (result, error) {
            if (!error) {
                res.status(result.status).json(result.data);
            } else {
                res.status(error.status).json(error.data);
            }
        });
    });

    return router;
}

module.exports = UserRoutes();