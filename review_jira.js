// ==UserScript==
// @name         review Jira
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jira.cvte.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      *
// ==/UserScript==
var jiraPrefix = 'https://jira.cvte.com/browse/';
var jiraCommonPrefix = 'https://'+document.domain;

function reviewJira(){
    var transitionsJiraUrl = jiraCommonPrefix + '/rest/api/2/issue/' + getCurJiraKey() + '/transitions'
    GM_xmlhttpRequest({
        method: "POST",
        url: transitionsJiraUrl,
        headers: {
            "Content-Type": "Application/json",
            "X-Atlassian-Token":"no-check",
            "User-Agent":""
        },
        data:JSON.stringify({
            'transition': {'id': 291}
        }),
        onload: function(response) {
            console.log(this.name + "结果:" + response.responseText);
            location.reload();
        }
    });
}

function getCurJiraKey(){
    const assigneeEle = document.getElementsByClassName("issue-link");
    return assigneeEle[0].getAttribute("data-issue-key");
}

function start() {
    var isButton = document.getElementById("review_tcs_button");
    clearInterval(startTimer);
    if(isButton!=null){
        console.log("already exist, exit");
        return
    }
    var reviewJiraButton = document.createElement('button');
    var parent = document.getElementsByClassName("aui-toolbar2-primary");
    reviewJiraButton.addEventListener("click", reviewJira);
    reviewJiraButton.innerText = '快速审核';
    reviewJiraButton.className = "aui-button toolbar-trigger";
    reviewJiraButton.id = "review_tcs_button";
    parent[0].appendChild(reviewJiraButton);
}

(function() {
    startTimer = setInterval(start,1000);
    document.body.addEventListener('click', function() {
        clearInterval(startTimer);
        startTimer = setInterval(start, 1000);
    })
})();