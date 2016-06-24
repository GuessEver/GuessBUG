/* global jQuery */
/* global DUOSHUO */
/* global MathJax */
/* global md5 */
/* global marked */
/* global $ */

$(function() {
	/*  在textarea处插入文本--Start */
	(function($) {
		$.fn
				.extend({
					insertContent : function(myValue, t) {
						var $t = $(this)[0];
						if (document.selection) { // ie
							this.focus();
							var sel = document.selection.createRange();
							sel.text = myValue;
							this.focus();
							sel.moveStart('character', -l);
							var wee = sel.text.length;
							if (arguments.length == 2) {
								var l = $t.value.length;
								sel.moveEnd("character", wee + t);
								t <= 0 ? sel.moveStart("character", wee - 2 * t
										- myValue.length) : sel.moveStart(
										"character", wee - t - myValue.length);
								sel.select();
							}
						} else if ($t.selectionStart
								|| $t.selectionStart == '0') {
							var startPos = $t.selectionStart;
							var endPos = $t.selectionEnd;
							var scrollTop = $t.scrollTop;
							$t.value = $t.value.substring(0, startPos)
									+ myValue
									+ $t.value.substring(endPos,
											$t.value.length);
							this.focus();
							$t.selectionStart = startPos + myValue.length;
							$t.selectionEnd = startPos + myValue.length;
							$t.scrollTop = scrollTop;
							if (arguments.length == 2) {
								$t.setSelectionRange(startPos - t,
										$t.selectionEnd + t);
								this.focus();
							}
						} else {
							this.value += myValue;
							this.focus();
						}
					}
				})
	})(jQuery);
	/* 在textarea处插入文本--Ending */
});

function flushAnnouncementBoxContent() {
	$.ajax({
		url: "/api/problem.show?oj=0&id=0",
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] === "ok") {
				var article = msg["data"];
				document.getElementById("announcementBoxContent").innerHTML =
					 '<a href = "/article/show/' + article[0]["aid"] + '">' + article[0]["title"] + '</a>'
					+' <em>......<a href = "/problem/0/0"> see more</a><em>';
			}
		}
	});
}
function flushUserLogNav() {
	$.ajax({
		url: "/api/user.data",
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			var HTML = "";
			if(msg["status"] === "1") {
				HTML =
					 '<a href = "/blog/' + msg["name"] + '">Blog</a> | ' 
					+'<a href = "/profile">Profile</a> | ' 
					+'<a href = "javascript:dologout();">Sign out</a> | ';
			}
			else {
				HTML = '<a href = "/login">Sign in</a> | ';
			}
			document.getElementById("userLogNav").innerHTML = HTML;
			/* user center on topbar nav */
			if(document.getElementById("userCenter")) {
				if(msg["status"] === "1") {
					document.getElementById("userCenter").innerHTML =
						 '<div class = "userCenter" id = "userCenter">'
						+  '<div style = "height: 34px;">'
						+    '<span><strong>' + msg["name"] + '</strong></span>'
						+    '<img src = "' + getUserAvatar(msg["email"]) + '?s=34" style = "padding-left: 30px;">'
						+  '</div>'
						+  '<div class = "userCenterBlock" style = "display: none;" id = "userCenterBlock">'
						+    '<ul class="nav nav-pills nav-stacked">'
						+      '<li role="presentation"><a href="/problem/0/0">Site Announcement</a></li>'
						+      '<li role="presentation"><a href="//paste.guessbug.com">Code paste</a></li>'
						+      '<li role="presentation"><a href="/article/new">New Article</a></li>'
						+      '<li role="presentation"><a href="/blog/' + msg["name"] + '">My Blog</a></li>'
						+      '<li role="presentation"><a href="/profile">My Profile</a></li>'
						+      '<li role="presentation"><a href="javascript:dologout();">Sign out</a></li>'
						+    '</ul>'						
						+  '</div>'
						+'</div>';				
				}
				else {
					document.getElementById("userCenter").innerHTML =
						 '<div class = "userCenter" id = "userCenter">'
						+  '<div style = "height: 34px;">'
						+    '<span><strong>Sign in for more.</strong></span>'
						+    '<img src = "' + getUserAvatar('') + '?s=34" style = "padding-left: 30px;">'
						+  '</div>'
						+  '<div class = "userCenterBlock" style = "height: 230px !important; display: none;" id = "userCenterBlock">'
						+    '<ul class="nav nav-pills nav-stacked">'
						+      '<li role="presentation"><a href="/problem/0/0">Site Announcement</a></li>'
						+      '<li role="presentation"><a href="//paste.guessbug.com">Code paste</a></li>'
						+      '<li role="presentation"><a href="/blog/GuessEver">administrator\'s Blog</a></li>'
						+      '<li role="presentation"><a href="/register">Register</a></li>'
						+      '<li role="presentation"><a href="/login">Sign in</a></li>'
						+    '</ul>'						
						+  '</div>'
						+'</div>';				
				}
			}
		}
	});
}
function flushOJSelector() {
	$.ajax({
		url: "/api/oj.show",
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] !== "ok") {
				alert(msg["log"]);
				return;
			}
			var data = msg["data"];
			//alert(data);
			var HTML = '';
			for(var i = 0; i < data.length; i++) {
				HTML += '<option>' + data[i] + '</option>';
			}
			document.getElementById("inputProblemOJ").innerHTML = HTML;
		}
	});
};
function flushProblemSolutionList(oj, id) {
	$.ajax({
		url: "/api/problem.show?oj=" + oj + "&id=" + id,
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] !== "ok") {
				alert(msg["log"]);
				return;
			}
			var data = msg["data"];
			document.getElementById("numberofSolutions").innerText = data.length;
			var HTML = '';
			if(data.length === 0) {
				HTML = '<h3><small>There\'s no solution for this problem, just because I\'ve not tried yet.</small></h3>';
				HTML += '<h3><small>If you think it worth a try, you can leave me a message.</small></h3>';
				showArticle(2);
			}
			else {
				HTML = '<ul>';
				for(var i = 0; i < data.length; i++) {
					HTML += '<li><a href = "javascript:showArticle(' + data[i]["aid"] + ');">' + data[i]["title"] + '</a> <small style = "color:gray;">by <em>' + data[i]["author"] + '</em></small></li>';
				}
				HTML += '</ul>';
				showArticle(data[0]["aid"]);
			}
			document.getElementById("problemSolutionList").innerHTML = HTML;
		}
	});
}
function flushArticleInformation(aid) {
	$.ajax({
		url: "/api/article.show?aid=" + aid,
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] === "no") {
				goto404Page();
				return;
			}
			if(msg["log"] !== "ok") {
				alert(msg["log"]);
				return;
			}
			var article = msg["data"];
			document.title = article["title"] + " | GuessBUG";
			if(document.getElementById("articleAuthor"))
				document.getElementById("articleAuthor").innerHTML = '<a href = "/blog/' + article["from_username"] + '">' + article["from_username"] + '</a>';
			if(document.getElementById("articleSubmitTime"))
				document.getElementById("articleSubmitTime").innerText = article["submit_time"];
			if(document.getElementById("articleForProblem")) {
				if(article["for_prob_oj"] === "0") document.getElementById("articleForProblem").innerHTML = '<a href = "/problem/' + article["for_prob_oj"] + '/' + article["for_prob_id"] + '">Announcement</a>';
				else document.getElementById("articleForProblem").innerHTML = '<a href = "/problem/' + article["for_prob_oj"] + '/' + article["for_prob_id"] + '">' + article["for_prob_oj"] + ' ' + article["for_prob_id"] + '</a>'; 
			}
			if(document.getElementById("articleTitle"))
				document.getElementById("articleTitle").innerText = article["title"];
			if(document.getElementById("articleContent")) {
				document.getElementById("articleContent").innerText = article["content"];
				flushMarkdownContent(document.getElementById("articleContent"), article["content"]);
			}
			if(document.getElementById("inputArticleTitle"))
				document.getElementById("inputArticleTitle").value = article["title"];
			if(document.getElementById("inputArticleContent"))
				document.getElementById("inputArticleContent").value = article["content"];
			if(document.getElementById("inputFor_prob_oj"))
				document.getElementById("inputFor_prob_oj").value = article["for_prob_oj"];
			if(document.getElementById("inputFor_prob_id"))
				document.getElementById("inputFor_prob_id").value = article["for_prob_id"];
			toggleDuoshuoComments('#articleCommentBox', aid, site + "/article/show/" + aid, article["title"]);
			if(document.getElementById("articleOperationButton")) {
				$.ajax({
					url: "/api/user.data",
					type: "get",
					success: function (msg) {
						msg = JSON.parse(msg);
						if(msg["status"] === "1" && (msg["level"] === "9" || msg["name"] === article["from_username"])) {
							var HTML = '<a href = "/article/edit/' + aid + '"><button class = "btn btn-success btn-xs"><span class = "glyphicon glyphicon-pencil"></span> Edit</button></a> ';
							if(article["visiblity"] === "1")
								HTML += '<button class = "btn btn-danger btn-xs" onclick = "dodeleteArticle(' + aid + ', this)"><span class = "glyphicon glyphicon-trash"></span> Delete</button>';
							else HTML += '<button class = "btn btn-danger btn-xs" disabled><del><span class = "glyphicon glyphicon-trash"></span> Deleted</del></button>';
							document.getElementById("articleOperationButton").innerHTML = HTML;
						}
					}
				});
			}
		}
	});
}
function flushMarkdownContent(target, origin) {
	target.innerHTML = marked(origin);
	//target.document.getElementsByTagName("table").addAttribute("class", "table");
	$("table", "#articleContent").addClass("table table-bordered table-hover");
	MathJax.Hub.Queue(["Typeset",MathJax.Hub, target]);
}
function showArticle(aid) { // #articleArea
	var url = site + "/article/show/" + aid;
	var HTML =
		 '<h2 id = "articleTitle"></h2>'
		+'<div class = "row">'
		+  '<div class = "col-sm-6">'
		+    '<h5><small>Authored by <strong><em id = articleAuthor></em></strong> at <strong><em id = "articleSubmitTime"></em></strong> for <strong><em id = "articleForProblem"></strong></em></small></h5>'
		+  '</div>'
		+  '<div class = "col-sm-6">'
		+    '<p align = "right" id = "articleOperationButton"></p>'
		+  '</div>'
		+'</div>'
		+'<hr>'
 		+'<markdown id = "articleContent"></markdown>'
		+'<p align = "left" style = "color:gray;"><small>更多完整代码访问站长 <a href = "//github.com/GuessEver/ACMICPCSolutions">Github</a></small></p>'
		+'<p align = "right" style = "color:gray;"><small>*** 转载请注明文章来源 <a href = "' + url + '">' + url + '</a> ***</small></p>'
		+'<div id="articleCommentBox"></div>';
	document.getElementById("articleArea").innerHTML = HTML;
	flushArticleInformation(aid);
}
function flushEveryUserIntrackbackPage() {
	$.ajax({
		url: "/api/user.list",
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] !== "ok") {
				alert(msg["log"]);
				return;
			}
			var user = msg["data"];
			var HTML = '<h3><small>The most</small> ' + user.length + ' <small>active users</small></h3>'
				+'<table class = "table table-hover">';
			for(var i = 0; i < user.length; i++) {
				HTML +=
					 '<tr>'
					+  '<td width = "100px" style = "min-width: 100px;" class = "hidden-xs">'
					+    '<a href = "/blog/' + user[i]["name"] + '"><img src = "' + getUserAvatar(user[i]["email"]) + '?s=90"></a>'
					+  '</td>'
					+  '<td width = "100%">'
					+    '<p><span style = "font-size: 16px;" class = "glyphicon glyphicon-user"></span> <strong><a href = "/blog/' + user[i]["name"] + '">' + user[i]["name"] + '</a></strong>'
					+    ' <small><span style = "color: gray;">' + user[i]["status"] + '</span></small></p>'
					+    '<p><span style = "font-size: 16px;" class = "glyphicon glyphicon-envelope"></span> ' + user[i]["email"] + '</p>'
					+    '<p><span style = "font-size: 16px;" class = "glyphicon glyphicon-home"></span> <a href = "' + user[i]["homepage"] + '">' + user[i]["homepage"] + '</a></p>'
					+  '</td>'
					+'</tr>';
			}
			HTML += '</table>';
			document.getElementById("trackbackPage").innerHTML = HTML;
		}
	});
}
function flushUserBlogList(username, page) {
	document.getElementById("userBlogList").innerHTML =
		 '<tr>'
		+  '<th width = "15%">Submit Time</th>'
		+  '<th width = "70%">Title</th>'
		+  '<th width = "15%" id = "blogListNewArticleBtn"></th>'
		+'</tr>';
	$.ajax({
		url: "/api/blog.show?username=" + username + "&page=" + page,
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] !== "ok") {
				if(msg["log"] === "no") {
					goto404Page();
				}
				else {
					alert(msg["log"]);
				}
				return;
			}
			var blog = msg["data"], totpage = msg["total_pages"]; page = msg["current_page"]
			history.replaceState(null, null, '/blog/' + username + "/" + page);
			var HTML = "";
			for(var i = 0; i < blog.length; i++) {
				HTML +=
					 '<tr>'
					+  '<td width = "15%">' + blog[i]["submit_time"] + '</td>'
					+  '<td width = "70%"><a href = "/article/show/' + blog[i]["aid"] + '">' + blog[i]["title"] + '</a>' + (blog[i]["visiblity"] === "1" ? '' : ' <code>hidden</code>') + '</td>'
				 	+  '<td width = "15%" id = "blogListOperation_' + i + '"></td>'
					+'</tr>';
			}
			document.getElementById("userBlogList").innerHTML += HTML;
			var prePageUrl = "/blog/" + username + "/" + (Number(page) - 1);
			var pageChooseBarHTML =
				 '<nav>'
				+  '<ul class = "pagination pagination-sm">'
				+    '<li' + (page === "1" ? ' class = "disabled"' : '') + '>'
				+      '<a href = "' + (page === "1" ? 'javascript:' : prePageUrl) + '" aria-label = "Previous">'
				+        '<span aria-hidden = "true">&laquo;</span>'
				+      '</a>'
				+    '</li>';
			for(var i = 1; i <= totpage; i++) {
				var pageUrl = "/blog/" + username + "/" + i;
				pageChooseBarHTML +=
				     '<li' + (page === i.toString() ? ' class = "active"' : '') + '><a href = "' + pageUrl + '">' + i + '</a></li>';
			}
			var nextPageUrl = "/blog/" + username + "/" + (Number(page) + 1);
				pageChooseBarHTML +=
				     '<li' + (page === totpage ? ' class = "disabled"' : '') + '>'
				+      '<a href = "' + (page === totpage ? 'javascript:' : nextPageUrl) + '" aria-label = "Previous">'
				+        '<span aria-hidden = "true">&raquo;</span>'
				+      '</a>'
				+    '</li>'
				+  '</ul>'
				+'</nav>';
			document.getElementById("pageChoose").innerHTML += pageChooseBarHTML;
			$.ajax({
				url: "/api/user.data",
				type: "get",
				success: function (msg2) {
					var user = JSON.parse(msg2);
					if(user["log"] !== "ok") {
						alert(user["log"]);
						return;
					}
					if(user["level"] == "9" || (user["status"] === "1" && user["name"] === username)) {
						document.getElementById("blogListNewArticleBtn").innerHTML = 
							'operation <a href = "/article/new"><button class = "btn btn-primary btn-xs">New</button></a>';
						for(var i = 0; i < blog.length; i++) {
							var tmpHTML = 
								'<a href = "/article/edit/' + blog[i]["aid"] + '"><button class = "btn btn-success btn-xs"><span class = "glyphicon glyphicon-pencil"></span> Edit</button></a> ';
							if(blog[i]["visiblity"] === "1")
								tmpHTML += '<button class = "btn btn-danger btn-xs" onclick = "dodeleteArticle(' + blog[i]["aid"] + ', this);"><span class = "glyphicon glyphicon-trash"></span> Delete</button>';
							else tmpHTML += '<button class = "btn btn-danger btn-xs" disabled><del><span class = "glyphicon glyphicon-trash"></span> Deleted</del></button>';
							document.getElementById("blogListOperation_" + i).innerHTML = tmpHTML;
						}
					}
				}
			});
		}
	});
}
function flushTimelineBlock() {
	$.ajax({
		url: "/api/article.newly",
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] !== "ok") {
				alert(msg["log"]);
				return;
			}
			var data = msg["data"];
			var HTML = 
				 '<h3><small>The latest</small> ' + data.length + ' <small> news</small></h3>'
				+'<table class = "table table-hover">';
			for(var i = 0; i < data.length; i++) {
				HTML +=
					 '<tr>'
					+  '<td width = "50px" style = "min-width: 50px;">'
					+    '<a href = "/blog/' + data[i]["from_username"] + '/">'
					+      '<img src = "' + getUserAvatar(data[i]["from_useremail"]) + '?s=45">'
					+    '</a>'
					+  '</td>'
					+  '<td width = "100%">'
					+    '<span>' + data[i]["submit_time"] + ' </span>'
					+    '<span><a href = "/article/show/' + data[i]["aid"] + '">' + data[i]["title"] + '</a> </span>'
					+    '<span><h5><small><em>Authored by <a href = "/blog/' + data[i]["from_username"] + '">' + data[i]["from_username"] + '</a></em></small></h5></span>'
					+  '</td>'
					+'</tr>';
			}
			HTML += "</table>";
			document.getElementById("timelineBlock").innerHTML = HTML;
		}
	});
}

function createTopBar(flag) {
	if(flag === 1) {
		if(document.getElementById("mainpage_top").innerHTML !== '') return;
		document.getElementById("mainpage_top").setAttribute("style", "");
		var HTML = 
			 '<div class = "container-fluid row">'
			+  '<div class = "hidden-xs col-sm-3" align = "left">'
			+    '<a href = "/"><img src = "/upload/site/logo1.png" height = "34px"></a>'
			+  '</div>'
			+  '<div class = "col-sm-6">'
			+    createProblemSearch()
			+  '</div>'
			+  '<div class = "hidden-xs col-sm-3" id = "userCenter" align = "right"></div>'
			+'</div>';
		document.getElementById("mainpage_top").innerHTML = HTML;
		flushOJSelector();
	}
	else {
		document.getElementById("mainpage_top").setAttribute("style", "display: none;");
		document.getElementById("mainpage_top").innerHTML = '';
	}
	flushUserLogNav();
};
function createProblemSearch() {
	var HTML =
		 '<form onsubmit = "return false;">' 
		+  '<div class = "row">'
		+    '<div class = "col-xs-5">'
		+      '<select class = "form-control" id = "inputProblemOJ">'
		+      '</select>'
		+    '</div>'
		+    '<div class = "col-xs-4">'
		+      '<input class = "form-control" id = "inputProblemId" placeholder = "Problem ID">'
		+    '</div>'
		+    '<div class = "col-xs-3">'
		+      '<button class = "btn btn-success" onclick = "gotoProblemPage();">Debug</button>'
		+    '</div>'
		+  '</div>'
		+'</form>';
	return HTML;
};
function create404Page() {
	var HTML =
		 '<div align = "center">'
		+  '<h1>404 </h1>'
		+  '<hr>'
		+  '<h1><small>Maybe you have entered a wrong place.</small></h1>'
		+  '<h3><small><a href = "javascript:history.go(-1);">Back</a> or <a href = "/">Home</a></small></h3>'
		+'</div>';
	return HTML;
}
function createMarkdownPage(aid, username) {
	var url = "/article/show/" + aid;
	if(aid === -1) url = "/blog/" + username;
	var HTML =
		 '<div class = "row">'
		+  '<div class = "col-sm-6">'
		+    '<h2>Edit</h2><hr>'
		+    '<div class = "row">'
		+      '<div class = "col-md-9 col-xs-7">'
		+        '<input type = "text" class = "form-control" id = "inputArticleTitle" placeholder = "Title">'
		+      '</div>'
		+      '<div class = "col-md-3 col-xs-5" align = "right">'
		+        '<button class = "btn btn-danger btn-sm" onclick = "submitArticle(this, ' + aid + ');">V</button> '
		+        '<a href = "' + url + '"><button class = "btn btn-default btn-sm">X</button></a>'
		+      '</div>'
		+    '</div>'
		+    '<div class = "row">'
		+      '<div class = "col-sm-6 col-xs-6">'
		+        '<input type = "text" class = "form-control" id = "inputFor_prob_oj" placeholder = "OJ">'
		+      '</div>'
		+      '<div class = "col-sm-6 col-xs-6">'
		+        '<input type = "text" class = "form-control" id = "inputFor_prob_id" placeholder = "ID">'
		+      '</div>'
		+    '</div>'
		+    '<div id = "EditButton">'
		+      '<div class="btn-group" role="group" aria-label="picBtn">'
		+        '<button class="btn btn-default btn-sm" onclick = "insertLink();"><span class = "glyphicon glyphicon-link"></span></button>'
		+      '</div> '
		+      '<div class="btn-group" role="group" aria-label="codeBtn">'
		+        '<button class="btn btn-default btn-sm" onclick = "insertCodeBlock();"><span class = "glyphicon glyphicon-console"></span></button>'
		+        '<button class="btn btn-default btn-sm" onclick = "insertCodePage();"><span class = "glyphicon glyphicon-file"></span></button>'
		+      '</div> '
		+      '<div class="btn-group" role="group" aria-label="picBtn">'
		+        '<button class="btn btn-default btn-sm" onclick = "insertPictureLink();"><span class = "glyphicon glyphicon-picture"></span></button>'
		+      '</div> '
		+    '</div>'
		+    '<textarea class = "form-control" rows = "17" placeholder = "Content (Markdown & MathJax supported)" id = "inputArticleContent"></textarea>'
		+  '</div>'
		+  '<div class = "col-sm-6">'
		+    '<h2>Preview</h2><hr>'
		+    '<div style = "border: 1px lightgray solid; height: 450px; overflow-y: auto;">'
		+      '<h2 id = "articleTitle"></h2><hr>'
		+      '<markdown id = "articleContent"></markdown>';
		+    '</div>'
		+  '</div>'
		+'</div>';
	return HTML;
}
function insertLink() {
	var link = prompt("Website address begun with http:// or https://");
	if(!link) return;
	$("#inputArticleContent").insertContent("[" + link + "](" + link + ")");
}
function insertCodeBlock() {
	$("#inputArticleContent").insertContent("\n```\n***your code here***\n```\n");
}
function insertCodePage() {
	window.open('//paste.guessbug.com', '_insertCodePage', 'channelmode = 1, width = 800, height = 500');
}
function insertPictureLink() {
	var link = prompt("Your picture address:");
	if(!link) return;
	$("#inputArticleContent").insertContent("![" + link + "](" + link + ")");
}

function domodifyUser(uid) {
	$.ajax({
		url: "/api/user.modify",
		type: "post",
		data: {
			uid: uid,
			oldPassword: md5(document.getElementById("inputOldPassword").value),
			newPassword: md5(document.getElementById("inputPassword").value),
			email: document.getElementById("inputEmail").value,
			homepage: document.getElementById("inputHomepage").value
		},
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] !== "ok") {
				alert(msg["log"]);
				return;
			}
			dologout();
		}
	});
}
function dodeleteArticle(aid, btn) {
	$.ajax({
		url: "/api/article.visible?aid=" + aid + "&visible=0",
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] !== "ok") {
				alert(msg["log"]);
				return;
			}
			btn.innerHTML = "<del>Deleted</del>";
			btn.setAttribute("disabled", "");
		}
	});
}
function submitArticle(btn, aid) {
	$(btn).button("loading"); 
	if(aid === -1) {
		$.ajax({
			url: "/api/article.new",
			type: "post",
			data: {
				for_prob_oj: document.getElementById("inputFor_prob_oj").value,
				for_prob_id: document.getElementById("inputFor_prob_id").value,
				title: document.getElementById("inputArticleTitle").value,
				content: document.getElementById("inputArticleContent").value
			},
			success: function (msg) {
				$(btn).button("reset");
				msg = JSON.parse(msg);
				if(msg["log"] !== "ok") {
					alert(msg["log"]);
					return;
				}
				else gotoURI("/article/show/" + msg["aid"]);
			}
		});
	}
	else {
		$.ajax({
			url: "/api/article.edit?aid=" + aid,
			type: "post",
			data: {
				for_prob_oj: document.getElementById("inputFor_prob_oj").value,
				for_prob_id: document.getElementById("inputFor_prob_id").value,
				title: document.getElementById("inputArticleTitle").value,
				content: document.getElementById("inputArticleContent").value
			},
			success: function (msg) {
				$(btn).button("reset");
				msg = JSON.parse(msg);
				if(msg["log"] !== "ok") {
					alert(msg["log"]);
					return;
				}
				else gotoURI("/article/show/" + aid);
			}
		});
	}
}
function doregister() {
	$.ajax({
		url: "/api/user.register",
		type: "post",
		data: {
			invitation: document.getElementById("inputInvitationNumber").value,
			name: document.getElementById("inputUserName").value,
			password: document.getElementById("inputPassword").value,
			email: document.getElementById("inputEmail").value,
			homepage: document.getElementById("inputHomepage").value
		},
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] !== "ok") {
				alert(msg["log"]);
				return;
			}
			else {
				gotoURI("/login")
			}
		}
	});
}
function dologin(url) {
	$.ajax({
		url: "/api/user.login",
		type: "post",
		data: {
			name: document.getElementById("inputUserName").value,
			password: md5(document.getElementById("inputPassword").value)
		},
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] === "ok") {
				gotoURI("/");
			}
			else {
				alert(msg["log"]);
			}
		}
	});
}
function dologout() {
	$.ajax({
		url: "/api/user.logout",
		type: "get",
		success: function (msg) {
			msg = JSON.parse(msg);
			if(msg["log"] === "ok") {
				window.location.reload();
			}
			else {
				alert(msg["log"]);
			}
		}
	});
}
function goto404Page() {
	createTopBar(1);
	document.getElementById("mainpage_middle").innerHTML = create404Page();
}
function gotoProblemPage() {
	var oj = document.getElementById("inputProblemOJ").value;
	var id = document.getElementById("inputProblemId").value;
	//alert(oj + " " + id);
	if(id === "") {
		alert("Please input problem id.");
		return;
	}
	gotoURI("/problem/" + oj + "/" + id);
};
function getPath() {
	var path = window.location.pathname;
	if(path[0] === '/') path = path.substr(1);
	if(path[path.length - 1] === '/') path = path.substr(0, path.length - 1);
	return path.split("/");
};
function replaceURI(url) {
	history.replaceState(null, null, url);
	tabSwitching();
}
function gotoURI(url) {
	if(url === "/") {
		window.location.href = "/";
		return;
	}
	history.pushState(null, null, url);
	tabSwitching();
}
function tabSwitching() {
	var path = getPath();
	var HTML = '';
	if(path[0] === '' && path.length === 1) { // home
		document.title = "GuessBUG";
		createTopBar(1);
		HTML =
			 '<div align = "center" style = "margin-top: 50px;">'
			+  '<img src = "/upload/site/logo1.png">'
			+  '<h1><small>A website which collects solutions of some problems.</small></h1>'
			+'</div>';
		document.getElementById("mainpage_middle").innerHTML = HTML;
	}
	else if(path[0] === 'problem' && path.length === 3) {
		var oj = path[1], id = path[2];
		if(oj === "0") document.title = "Announcement | GuessBUG"; 
		else document.title = "Problem >> " + oj + " " + id + " | GuessBUG";
		createTopBar(1);
		HTML = 
			 '<div class = "container-fluid row">'
			+  '<div class = "col-sm-4">';
		if(oj === "0") HTML +='<h2>Announcement</h2>';
		else HTML +='<h2>' + oj + ' ' + id + '</h2>';
		HTML +=
			     '<div class = "row">'
			+      '<div class = "col-xs-12">'
			+        '<h5><small><strong><span id = "numberofSolutions"></span></strong> Solutions found</small></h5>'
			+      '</div>'
			+    '</div>'
			+    '<hr>'
			+    '<div id = "problemSolutionList"></div>'
			+    '<div style = "font-size:12px;color:gray;">Or you can vist administrator\'s <a href = "//github.com/GuessEver/ACMICPCSolutions">Github</a> for more codes</div>'
			+  '</div>'
			+  '<div class = "col-sm-8 left-line" id = "articleArea">'
			+  '</div>'
			+'</div>';
		document.getElementById("mainpage_middle").innerHTML = HTML;
		flushProblemSolutionList(oj, id);
	}
	else if(path[0] === 'article') {
		document.title = "Article | GuessBUG";
		createTopBar(1);
		if(path[1] === "show" && path.length === 3) {
			HTML = '<div id = "articleArea"></div>';
			document.getElementById("mainpage_middle").innerHTML = HTML;
			showArticle(path[2]);
		}
		else if(path[1] === "edit" && path.length === 3) {
			$.ajax({
				url: "/api/user.data",
				type: "get",
				success: function (msg) {
					msg = JSON.parse(msg);
					if(msg["log"] !== "ok") {
						alert(msg["log"]);
						return;
					}
					if(msg["status"] === "1") {
						document.getElementById("mainpage_middle").innerHTML = createMarkdownPage(path[2], msg["name"]);
						flushArticleInformation(path[2]);
					}
					else replaceURI("/login");
				}
			});
		}
		else if(path[1] === "new" && path.length === 2) {
			$.ajax({
				url: "/api/user.data",
				type: "get",
				success: function (msg) {
					msg = JSON.parse(msg);
					if(msg["log"] !== "ok") {
						alert(msg["log"]);
						return;
					}
					if(msg["status"] === "1") {
						document.getElementById("mainpage_middle").innerHTML = createMarkdownPage(-1, msg["name"]);
					}
					else replaceURI("/login");
				}
			});
		}
		else {
			document.getElementById("mainpage_middle").innerHTML = create404Page();
		}
	}
	else if(path[0] === 'trackback' && path.length === 1) {
		document.title = "Trackback | GuessBUG";
		createTopBar(1);
		document.getElementById("mainpage_middle").innerHTML = 
			 '<div class = "row">'
			+  '<div class = "col-sm-6" id = "trackbackPage"></div>'
			+  '<div class = "col-sm-6" id = "timelineBlock"></div>'
			+'</div>';
		flushEveryUserIntrackbackPage();
		flushTimelineBlock();
	}
	else if(path[0] === 'blog' && (path.length === 2 || path.length === 3)) {
		var username = path[1];
		var page = "1"; if(path.length === 3) page = path[2];
		if(!$.isNumeric(page)) replaceURI("/" + path[0] + "/" + path[1]);
		document.title = "Blog >> " + username + " | GuessBUG";
		createTopBar(1);
		HTML =
			 '<h2>' + username + '<small> \'s blog</small></h2>'
			+'<table class = "table" id = "userBlogList">'
			+'</table>'
			+'<div align = "center" id = "pageChoose"></div>';
		document.getElementById("mainpage_middle").innerHTML = HTML;
		flushUserBlogList(username, page);
	}
	else if(path[0] === 'profile' && path.length === 1) {
		document.title = "Profile | GuessBUG";
		createTopBar(1);
		$.ajax({
			url: "/api/user.data",
			type: "get",
			success: function (msg) {
				msg = JSON.parse(msg);
				if(msg["log"] !== "ok") {
					alert(msg["log"]);
					return;
				}
				if(msg["status"] !== "1") {
					replaceURI("/login");
					return;
				}
				document.getElementById("mainpage_middle").innerHTML =
					 '<div class = "row" style = "padding-top: 100px;">'
					+  '<div class = "col-sm-4" align = "right">'
					+    '<img src = "' + getUserAvatar(msg["email"]) + '?s=200">'
					+    '<hr>'
					+    '<p style = "color: gray"><a href = "//www.gravatar.com">Want to change photo?</a></p>'
					+  '</div>'
					+  '<div class = "col-sm-7 left-line">'
					+    '<form class = "form-horizontal" onsubmit = "return false;">'
					+      '<div class = "form-group">'
					+        '<label class = "col-sm-4 control-label">UserName</label>'
					+        '<div class = "col-sm-8">'
					+          '<p class="form-control-static">' + msg["name"] + '</p>'
					+        '</div>'
					+      '</div>'
					+      '<div class = "form-group">'
					+        '<label for = "inputOldPassword" class="col-sm-4 control-label">Old Password</label>'
					+        '<div class = "col-sm-8">'
					+          '<input type = "password" class = "form-control" id = "inputOldPassword" placeholder = "Old Password">'
					+        '</div>'
					+      '</div>'
					+      '<div class = "form-group">'
					+        '<label for = "inputPassword" class="col-sm-4 control-label">New Password</label>'
					+        '<div class = "col-sm-8">'
					+          '<input type = "password" class = "form-control" id = "inputPassword" placeholder = "New Password if you want to change">'
					+        '</div>'
					+      '</div>'
					+      '<div class = "form-group">'
					+        '<label for = "inputHomepage" class="col-sm-4 control-label">Homepage</label>'
					+        '<div class = "col-sm-8">'
					+          '<input type = "text" class = "form-control" id = "inputHomepage" placeholder = "Homepage" value = "' + msg["homepage"] + '">'
					+        '</div>'
					+      '</div>'
					+      '<div class = "form-group">'
					+        '<label for = "inputEmail" class="col-sm-4 control-label">Email</label>'
					+        '<div class = "col-sm-8">'
					+          '<input type = "text" class = "form-control" id = "inputEmail" placeholder = "Email" value = "' + msg["email"] + '">'
					+        '</div>'
					+      '</div>'
					+      '<div class = "form-group">'
					+        '<div class = "col-sm-12">'
					+          '<p align = "right"><button type = "submit" class = "btn btn-primary" onclick = "domodifyUser(' + msg["uid"] + ');">Save Changes</button></p>'
					+        '</div>'
					+      '</div>'
					+    '</form>'
					+  '</div>'
					+'</div>';
				document.getElementById("inputOldPassword").focus();
			}
		});
	}
	else if(path[0] === 'login' && path.length === 1) {
		document.title = "Sign in | GuessBUG";
		createTopBar(1);
		$.ajax({
			url: "/api/user.data",
			type: "get",
			success: function (msg) {
				msg = JSON.parse(msg);
				if(msg["status"] === "1") {
					replaceURI("/profile");
				}
				else {
					HTML = 
						 '<div class = "row">'
						+  '<div class = "col-sm-5">'
						+    '<img src = "/upload/site/logo2.png">'
						+  '</div>'
						+  '<div class = "col-sm-6 left-line" style = "margin-top: 80px;">'
						+    '<h2 align = "center">Sign in</h2><hr>'
						+    '<form class = "form-horizontal" onsubmit = "return false;">'
						+      '<div class = "form-group">'
						+        '<label for = "inputUserName" class = "col-sm-2 control-label">UserName</label>'
						+        '<div class = "col-sm-10">'
						+          '<input type = "text" class = "form-control" id = "inputUserName" placeholder = "User Name">'
						+        '</div>'
						+      '</div>'
						+      '<div class = "form-group">'
						+        '<label for = "inputPassword" class="col-sm-2 control-label">Password</label>'
						+        '<div class = "col-sm-10">'
						+          '<input type = "password" class = "form-control" id = "inputPassword" placeholder = "Password">'
						+        '</div>'
						+      '</div>'
						+      '<div class = "form-group">'
						+        '<div class = "col-sm-12">'
						+          '<p align = "right"><button type = "submit" class = "btn btn-success" onclick = "dologin();">Sign in</button></p>'
						+        '</div>'
						+      '</div>'
						+    '</form>'
						+    '<hr><h4><small>No Account yet? <a href = "/register">Registered here.</a></small></h4>'
						+  '</div>'
						+'</div>';
					document.getElementById("mainpage_middle").innerHTML = HTML;
					document.getElementById("inputUserName").focus();
				}
			}
		});
	}
	else if(path[0] === 'register' && path.length === 1) {
		document.title = "Register | GuessBUG";
		createTopBar(1);
		$.ajax({
			url: "/api/user.data",
			type: "get",
			success: function (msg) {
				msg = JSON.parse(msg);
				if(msg["status"] === "1") {
					replaceURI("/profile");
				}
				else {
					HTML = 
						 '<div class = "row">'
						+  '<div class = "col-sm-4">'
						+    '<img src = "/upload/site/logo2.png">'
						+  '</div>'
						+  '<div class = "col-sm-7 left-line" style = "margin-top: 40px;">'
						+    '<h2 align = "center">Register</h2><hr>'
						+    '<form class = "form-horizontal" onsubmit = "return false;">'
						+      '<div class = "form-group">'
						+        '<label for = "inputInvitationNumber" class = "col-sm-4 control-label">Invitation Number</label>'
						+        '<div class = "col-sm-8">'
						+          '<input type = "text" class = "form-control" id = "inputInvitationNumber" placeholder = "Invitation Number">'
						+        '</div>'
						+      '</div>'
						+      '<div class = "form-group">'
						+        '<label for = "inputUserName" class = "col-sm-4 control-label">User Name</label>'
						+        '<div class = "col-sm-8">'
						+          '<input type = "text" class = "form-control" id = "inputUserName" placeholder = "User Name (can only start with alpha, and length 5 ~ 15)">'
						+        '</div>'
						+      '</div>'
						+      '<div class = "form-group">'
						+        '<label for = "inputPassword" class="col-sm-4 control-label">Password</label>'
						+        '<div class = "col-sm-8">'
						+          '<input type = "password" class = "form-control" id = "inputPassword" placeholder = "Password (length 5 ~ 30)">'
						+        '</div>'
						+      '</div>'
						+      '<div class = "form-group">'
						+        '<label for = "inputHomepage" class = "col-sm-4 control-label">Homepage</label>'
						+        '<div class = "col-sm-8">'
						+          '<input type = "text" class = "form-control" id = "inputHomepage" placeholder = "Homepage">'
						+        '</div>'
						+      '</div>'
						+      '<div class = "form-group">'
						+        '<label for = "inputEmail" class = "col-sm-4 control-label">Email</label>'
						+        '<div class = "col-sm-8">'
						+          '<input type = "text" class = "form-control" id = "inputEmail" placeholder = "Email">'
						+        '</div>'
						+      '</div>'
						+      '<div class = "form-group">'
						+        '<div class = "col-sm-12">'
						+          '<p align = "right"><button type = "submit" class = "btn btn-success" onclick = "doregister();">Register</button></p>'
						+        '</div>'
						+      '</div>'
						+    '</form>'
						+    '<hr><h4><small>Already registered? <a href = "/login">Sign in here.</a></small></h4>'
						+  '</div>'
						+'</div>';
					document.getElementById("mainpage_middle").innerHTML = HTML;
					document.getElementById("inputInvitationNumber").focus();
				}
			}
		});
	}
	else if(path[0] === 'about' && path.length === 1) {
		document.title = "About | GuessBUG";
		createTopBar(1);
		HTML = '<div id = "articleArea"></div>';
		document.getElementById("mainpage_middle").innerHTML = HTML;
		showArticle(1);
	}
	else {
		goto404Page();
	}
};

/* GRAVATAR */
function getUserAvatar(email) {
	email = md5(email.trim().toLowerCase());
	//return "//www.gravatar.com/avatar/" + email;
	return "//gravatar.duoshuo.com/avatar/" + email;
}

/* DUOSHUO */
function toggleDuoshuoComments(container, key, url, title){
	if(window.location.hostname === "localhost") {
		$(container).html("<hr><h4><small>Avoid effecting database online, just show </small>DUOSHUO<small> like this</small><h4>");
		return;
	}
    var el = document.createElement('div');//该div不需要设置class="ds-thread"
    el.setAttribute('data-thread-key', key);//必选参数
    el.setAttribute('data-url', url);//必选参数
    el.setAttribute('data-title', title);//可选参数
    DUOSHUO.EmbedThread(el);
    $(container).append(el);
}

var site = "http://www.guessbug.com";
/* PJAX */
flushUserLogNav();
flushAnnouncementBoxContent();
tabSwitching();
$(document).on('click', 'a', function() {
	var url = this.href;
	var hostname = url.split("/")[2];
	//alert(hostname + " =?= " + window.location.host);
	if(hostname === window.location.host && url.split("/")[3] !== "") {
		gotoURI(url);
		return false;
	}
	else {
		if(hostname !== window.location.host) this.target = "_blank";
		return true;
	}
});
$(document).bind('input propertychange', function() {
	if(document.getElementById("inputArticleTitle")) {
		document.getElementById("articleTitle").innerHTML = document.getElementById("inputArticleTitle").value;
	}
	if(document.getElementById("inputArticleContent")) {
		document.getElementById("articleContent").innerHTML = document.getElementById("inputArticleContent").value;
		flushMarkdownContent(document.getElementById("articleContent"), document.getElementById("inputArticleContent").value);
	}
});
$(document).on("mouseover", "#userCenter", function () {
	$("#userCenterBlock").slideDown(100);
	$("#userCenter").on('mouseleave', function () {
		$("#userCenterBlock").slideUp(100);
	});
});
window.onpopstate = function () {
	tabSwitching();
};
