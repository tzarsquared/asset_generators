$(document).ready(function() {
	
	//global variables
	var currbox, box, xword;
	var firstBlock = "";
	var dir = "a";
	var active = true;
	var err = false;
	var text1, text2;
	
	$(".helpdiv").hide();
	$(".helptext").hide();
	
//CLICK BOX

	$(document).on("click", ".number", function() {
		if (err) {
			$("#xword_grid").find("td").removeClass("incorrect");
		}
		if (active) {
			updateCurrent($(this).next().attr("id"));
		}
	});
	
	$(document).on("click", ".space", function(e) {
		if (err) {
			$("#xword_grid").find("td").removeClass("incorrect");
		}
		if (active) {
			updateCurrent($(this).attr("id"));
		}
	});

//CLICK RESET
	$(document).on("click", "#reset", function() {
		active = true;
		$("#reset").hide();
		$("#check").show();
		$("#letter").show();
		$("#word").show();
		$("#xword_grid").find(".space").empty();
		updateCurrent(firstBlock);
	});//end click reset


//CLICK CHECK
	$(document).on("click", "#check", function() {
		
		var correct = true;
		$("#xword_grid").find("td").removeClass("incorrect");
		
		$.each(xword, function(r, row) {
			
			$.each(row.cells, function(c, cell) {
				if (cell.value != "") {
					if ($("#" + cell.id).html() != cell.value) {
						$("#" + cell.id).addClass("incorrect");
						$("#" + cell.id).prev().addClass("incorrect");
						correct = false;						
					}
				}//end if
			});//end each cell
			
		});//end each row
		
		$("#xword_grid").find("td").removeClass("curr");
		$("#xword_grid").find("td").removeClass("currword");
		if (correct) {
			alert("All correct");
			$("#check").hide();
			$("#word").hide();
			$("#letter").hide();
			active = false;
			$("#reset").show();
			$(".acrossclues").find("p").removeClass("active");
			$(".downclues").find("p").removeClass("active");
		}
		else {
			alert("There are some errors. Keep trying.");
			err = true;
		}
		
	});//end click check
	
	function reveal(box_id) {
		var row = parseInt(box_id.substr(0, box_id.indexOf("_")));
		var col = parseInt(box_id.substr(box_id.indexOf("_") + 1));
		$("#" + box_id).html(xword[row-1].cells[col-1].value);
	}//end reveal
	
	//CLICK REVEAL WORD
	$(document).on("click", "#word", function() {
		reveal(currbox);
		$(".currword").each(function () {
			if ($(this).hasClass("space")) {
				reveal($(this).attr("id"));
			}//end if
		});//end for each
	});//end reveal word
	
	//CLICK REVEAL LETTER 
	$(document).on("click", "#letter", function() {
		reveal(currbox);
	});//end reveal letter
	
	//GET CLUES JSON
	$.getJSON('data/clues.json', function(clueList) {
	
		function addClues(dir) {
			$.each(clueList[0][dir], function(c, clue) {
				var num = c + 1;
				if (clue != "") {
					$("." + dir + "clues").append("<p id='" + dir.substr(0,1) + num + "'>" + "<b>" + num + " " + dir.toUpperCase() + ": </b>" + clue + "</p>");
				}
			});
		}
		
		addClues("across");
		addClues("down");
	});
	
	//GET TEXT JSON
	$.getJSON('data/text.json', function(text) {
		$("#check").html(text[0].check);
		$("#reset").html(text[0].reset);
		$("#word").html(text[0].word);
		$("#letter").html(text[0].letter);
		$("#help").html(text[0].help);
		$("#xbox").html(text[0].xbox);
		$("title").html(text[0].title);
		text1 = text[0].instructions;
		text2 = text[0].reset_inst;
	});

	//GET XWORD JSON
	$.getJSON('data/xword.json', function(data) {
		xword = data;
		if (xword === undefined) {
			alert("There was a problem loading the quiz data");
		}	
		
		//POPULATE HTML
		$(".crossword_div").append("<table class='crossword' id='xword_grid'></table>");
		
		$.each(xword, function(r, row) {
			$("#xword_grid").append("<tr id='row" + row.row + "'></tr>");
			$.each(row.cells, function(c, cell) {
				var numid = "'>";
				var cls = "space";
				if (cell.value == "") {
					cls = "block";
					numid = " block'>";
				}
				else {
					if (cell.num != "") {
						numid = "' id='num" + cell.num + "'>" + cell.num;
					}
				}
				$("#row" + row.row).append("<td class='number" + numid + "</td>");
				$("#row" + row.row).append("<td class='" + cls + "' id='" + cell.id + "'></td>");
				if (cls != "block" && firstBlock == "") {
					firstBlock = cell.id;
				}
			});//end each cell
		});//end each row
		
		$("#reset").hide();
		updateCurrent(firstBlock);
	});//end getJSON
	
//CHECK WORD
		function checkWord(pre) {
			var loop = true;
			var att = pre + "_" + dir;
			var x = box[att];
			while (loop) {
				if (x != "") {
					$("#" + x).addClass("currword");
					$("#" + x).prev().addClass("currword");
					x = xword[parseInt(x.substr(0, x.indexOf("_"))) - 1].cells[parseInt(x.substr(x.indexOf("_") + 1)) - 1][att];
				} else {
					loop = false;
				}
			}
		}//end CHECK WORD

//CHANGE CURRBOX
		function updateCurrent(box_id) {

			//update global variables
			if (currbox != box_id) {
				currbox = box_id;
				box = xword[parseInt(currbox.substr(0, currbox.indexOf("_"))) - 1].cells[parseInt(currbox.substr(currbox.indexOf("_") + 1)) - 1];
				if (dir == "a" && box.a_clue == "") {
					dir = "d";
				}
				else {
					if (dir == "d" && box.d_clue == "") {
						dir = "a"
					}
				}
			}//end if
			else {
				if (dir == "a" && box.d_clue != "") {
					dir = "d";
				}
				else {
					if (dir == "d" && box.a_clue != "") {
						dir = "a"
					}
				}
			}//end else

			//remove all current classes
			$("#xword_grid").find("td").removeClass("curr");
			$("#xword_grid").find("td").removeClass("currword");

			//add class currbox to current box
			$("#" + currbox).addClass("curr");
			$("#" + currbox).prev().addClass("curr");

			//add class currword to rest of word
			checkWord("next");
			checkWord("prev");
	
			//highlight correct clue
			$(".acrossclues").find("p").removeClass("active");
			$(".downclues").find("p").removeClass("active");
			$("#" + box["a_clue"]).addClass("active");
			$("#" + box["d_clue"]).addClass("active");
			if (box.a_clue != "") {
				$("#" + box["a_clue"]).get(0).scrollIntoView();
			}
			if (box.d_clue != "") {
				$("#" + box["d_clue"]).get(0).scrollIntoView();
			}
		}//end UPDATE CURRENT
		
//TEXT ENTERED
	$(".keyboard").on("click", "td", function() {
		if ($(this).attr("id") != "del") {
			$("#" + currbox).html($(this).attr("id"));
			var mov = "next_" + dir;
			if (box[mov] != "") {
				updateCurrent(box[mov]);
			}
			else {
				newClue("next");
			}
		}
		else {
			$("#" + currbox).empty();
		}
	});//end click letter
	
	//click clue
	$(".clues").on("click", "p", function() {
		dir = $(this).attr("id").substr(0,1);
		var block = $("#num" + $(this).attr("id").substr(1)).next().attr("id");
		updateCurrent(block);
	});

//CLICK HELP
	$(document).on("click", "#help", function() {
		if (active) {
			$("#helptext").html(text1);
		}
		else {
			$("#helptext").html(text2);
		}
		$(".helpdiv").show();
		$(".helptext").show();
	});
	
	//CLICK CLOSE HELP
	$(document).on("click", "#xbox", function() {
		$(".helpdiv").hide();
		$(".helptext").hide();
	});

//KEY PRESS
	$(document)	.keyup(function(e) {
		var el = e.keyCode;
				
		//if delete
		if (el == 8 || el == 46) {
			$("#" + currbox).html("");
		}

		//if letter
		if (el > 96 && el < 123) {
			el -= 32;
		}
		if (el > 64 && el < 91) {
			el = "&#" + el.toString() + ";";
			$("#" + currbox).html(el);
			var mov = "next_" + dir;
			if (box[mov] != "") {
				updateCurrent(box[mov]);
			}
			else {
				newClue("next");
			}
		}

		//if arrow
		if (el > 36 && el < 41) {
			var r = currbox.substr(0, currbox.indexOf("_"));
			var c = currbox.substr(currbox.indexOf("_") + 1);
			
			switch (el) {
				case 37:
					if (c > 0) {
						c--;
					}
					break;
				case 38:
					if (r > 0) {
						r--;
					}
					break;
				case 39:
					if (c < xword.length) {
						c++;
					}
					break;
				case 40:
					if (r < xword.length) {
						r++;
					}
				}
			
			if ($("#" + r + "_" + c).hasClass("space")) {
				updateCurrent(r + "_" + c);
			}
		}
		
		//if PAGE UP - go to previous clue
		if (el == 33) {
			newClue("prev");
		}
		
		//if PAGE DOWN - go to next clue
		if (el == 34) {
			newClue("next");
		}

	});//end KEY PRESS

	function newClue(way) {		
		var newclue;
		if (way == "prev") {
			newclue = $("#" + box[dir + "_clue"]).prev().attr("id");
		}
		else {
			newclue = $("#" + box[dir + "_clue"]).next().attr("id");
		}
		var cluebox = "acrossclues";
		
		if (newclue === undefined) {
			if (dir == "a") {
				dir = "d";
				cluebox = "downclues";
			}
			else {
				dir = "a";
			}
			if (way == "next") {
				newclue = $("." + cluebox).children().first().attr("id");
			}
			else {
				newclue = $("." + cluebox).children().last().attr("id");
			}
		}
			
		var block = $("#num" + newclue.substr(1)).next().attr("id");
		updateCurrent(block);
	}

});//end document.ready