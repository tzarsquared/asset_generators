$(document).ready(function() {

	//global variables
	var currbox = $("#1_1");
	var size, noclue;

	function activate(boxid) {
		$("#xword_grid").find("td").removeClass("curr");
		currbox = $("#" + boxid);
		currbox.addClass("curr");
		currbox.prev().addClass("curr");
	}

//CLICK BOX
	$(document).on("click", ".number", function() {
		activate($(this).next().attr("id"));
	});
	
	$(document).on("click", ".box", function() {
		activate($(this).attr("id"));
	});

//CLICK GENERATE BUTTON
	$(document).on("click", "#gen", function() {
		size = $("#size").val();
		if (size < 2 || size > 15) {
			alert("Invalid size. Please enter a number between 2 and 15");
		}
		else {
			$("#btntbl").empty();
			$("#btntbl").append("<tr><td><button id='valid'>Validate</button></td></tr>");
			$("#tblhead").html("Populate grid");

			//create grid
			$(".grid").append("<table id='xword_grid'></table>");
			for (var x = 1; x <= size; x++) {
				$("#xword_grid").append("<tr id='row" + x + "'></tr>");

				for (var y = 1; y <= size; y++) {
					$("#row" + x).append("<td class='number'></td>");
					$("#row" + x).append("<td class='box space' id='" + x + "_" + y + "'></td>");
				}
			}
            activate("1_1");
		}
	});

//CLICK VALIDATE BUTTON
	$(document).on("click", "#valid", function() {
		var blank = true;
		for (x = 1; x <= size; x++) {
            if ($("#" + 1 + "_" + x).html() != "") {
                blank = false;
            }
		}
		
		if (blank) {
			alert("First row cannot be blank.");
		}
		
		if (!blank) {
			noclue = 1;
			var d_clues = [];
			var a_clues = [];
			var across , down;
			var above, below, left, right;
			var id, num, value;
			var a_clue, d_clue;
			var next_a, next_d, prev_a, prev_d;
			var json = "[\n";
		
			for (var rw = 1; rw <= size; rw++) {
				json = json + "\t{\t\"row\" : \"" + rw + "\",\n\t\t\"cells\" : [\n\t\t\t\t\t{\n";

				for (var cl = 1; cl <= size; cl++) {
					across = false;
					down = false;

					above = rw - 1;
					below = rw + 1;
					left = cl - 1;
					right = cl + 1;

					id = rw + "_" + cl;
					num = "";
					value = "";
					a_clue = "";
					d_clue = "";
					nexta = "";
					nextd = "";
					preva = "";
					prevd = "";
				
					if (!$("#" + id).html() == "") {
						if ($("#" + above + "_" + cl).html() != "" || $("#" + below + "_" + cl).html() != "") {
                            down = true;
                            if ((above == 0) && $("#" + below + "_" + cl).html() == "") {
                                down = false;
                            }
                            if ((below > size) && $("#" + above + "_" + cl).html() == "") {
                                down = false;
                            }
						}
						if ($("#" + rw + "_" + left).html() != "" || $("#" + rw + "_" + right).html() != "") {
							across = true;
                            if ((left == 0) && $("#" + rw + "_" + right).html() == "") {
                                across = false;
                            }
                            if ((right > size) && $("#" + rw + "_" + left).html() == "") {
                                across = false;
                            }
						}

						//is this block the start of a word across?
						if (across && ($("#" + rw + "_" + left).html() == "" || cl == 1)) {
							$("#" + id).prev().html(noclue);
							num = noclue++;
							var space = true;
							var bl = $("#" + id);
							var ans = "";
							var r = right;
							while (space) {
								ans = ans + bl.html();
								if (r <= size) {
									bl = $("#" + rw + "_" + r);
									space = bl.html() != "";
									r++;
								}
								else {
									space = false;
								}
							}
							a_clues[noclue - 1] = ans;
							a_clue = "a" + num;
						}
						
						//is this block the start of a word down?
						if (down && ($("#" + above + "_" + cl).html() == "" || rw == 1)) {
							if ($("#" + id).prev().html() == "") {
								$("#" + id).prev().html(noclue);
								num = noclue++;
							}
							else {
								$("#" + id).prev().html(noclue - 1);
							}
							var space = true;
							var bl = $("#" + id);
							var ans = "";
							var b = below;
							while (space) {
								ans = ans + bl.html();
								if (b <= size) {
									bl = $("#" + b + "_" + cl);
									b++;
									space = bl.html() != "";
								}
								else {
									space = false;
								}
							}
							d_clues[noclue - 1] = ans;
							d_clue = "d" + num;
						}

						value = $("#" + id).html();

						if (across && a_clue == "") {
							var space = true;
							var l = left - 1;
							var bl = $("#" + rw + "_" + left);
							while (space) {
								if ($("#" + rw + "_" + l).html() == "" || l < 1) {
									space = false;
								}
								else {
									bl = $("#" + rw + "_" + l);
									l--;
								}
							}
							a_clue = "a" + bl.prev().html()
						}
						
						if (down && d_clue == "") {
							var space = true;
							var a = above - 1;
							var bl = $("#" + above + "_" + cl);
							while (space) {
								if ($("#" + a + "_" + cl).html() == "" || a < 1) {
									space = false;
								}
								else {
									bl = $("#" + a + "_" + cl);
									a--;
								}
							}
							d_clue = "d" + bl.prev().html()
						}
					
						if (across && !$("#" + rw + "_" + right).html() == "" && right <= size) {
							nexta = rw + "_" + right;
						}// end if
						else {
							nexta = "";
						}
						if (across && !$("#" + rw + "_" + left).html() == "" && left > 0) {
							preva = rw + "_" + left;
						}// end if
						else {
							preva = "";
						}
						
						if (down && !$("#" + below + "_" + cl).html() == "" && below <= size) {
							nextd = below + "_" + cl;
						}// end if
						else {
							nextd = "";
						}
						if (down && !$("#" + above + "_" + cl).html() == "" && above > 0) {
							prevd = above + "_" + cl;
						}// end if
						else {
							prevd = "";
						}
				
					}//end if not block

					json = json + "\t\t\t\t\t\t\"id\" : \"" + id + "\",\n";
					json = json + "\t\t\t\t\t\t\"num\" : \"" + num + "\",\n";
					json = json + "\t\t\t\t\t\t\"value\" : \"" + value + "\",\n";
					json = json + "\t\t\t\t\t\t\"a_clue\" : \"" + a_clue + "\",\n";
					json = json + "\t\t\t\t\t\t\"d_clue\" : \"" + d_clue + "\",\n";
					json = json + "\t\t\t\t\t\t\"next_a\" : \"" + nexta + "\",\n";
					json = json + "\t\t\t\t\t\t\"prev_a\" : \"" + preva + "\",\n";
					json = json + "\t\t\t\t\t\t\"next_d\" : \"" + nextd + "\",\n";
					json = json + "\t\t\t\t\t\t\"prev_d\" : \"" + prevd + "\"\n";
					
					json = json + "\t\t\t\t\t}"
					if (cl < size) {
						json = json + ",\n\t\t\t\t\t{\n";
					}
					else {
						json = json + "\n\t\t\t\t]\n";
					}

				}//end for (cell)
				
				json = json + "\t}";
				if (rw < size) {
					json = json + ",\n";
				}
				else {
					json = json + "\n]";
				}
			
			}//end for (row)
			
			$("#btntbl").empty();
			$("#tblhead").html("Crossword generator");
			$(".grid").empty();
			$(".grid").append("<p>Insert the instructions and button text as well as the clues for the crossword answers into the following form.</p>");

			//form for clues
			$("#form").append("<form action='generate.php' method='post' id='clueform'></form>");
			$("#clueform").append("<table id='texttbl'></table>");
			$("#texttbl").append("<tr><td>Asset ID:</td><td><input type='text' name='id' value='assetID' required></td></tr>");
			$("#texttbl").append("<tr><td>Asset title:</td><td><input type='text' name='title' value='Crossword' required></td></tr>");
			$("#texttbl").append("<tr><td colspan='2'><b>Buttons text</b></td></tr>");
			$("#texttbl").append("<tr><td>Check answers:</td><td><input type='text' name='check' value='Check answers' required></td></tr>");
			$("#texttbl").append("<tr><td>Reveal letter:</td><td><input type='text' name='letter' value='Reveal letter' required></td></tr>");
			$("#texttbl").append("<tr><td>Reveal word:</td><td><input type='text' name='word' value='Reveal word' required></td></tr>");
			$("#texttbl").append("<tr><td>Reset:</td><td><input type='text' name='reset' value='Reset' required></td></tr>");
			$("#texttbl").append("<tr><td>Help:</td><td><input type='text' name='help' value='Help' required></td></tr>");
			$("#texttbl").append("<tr><td colspan='2'><b>Instructions text</b></td></tr>");
			$("#texttbl").append("<tr><td>Instructions:<br><br><i>Use \"&lt;br&gt;\" tags to insert<br>line breaks.<br><br>You can also use any<br>other HTML tags, e.g.<br>\"&lt;b&gt;\" or \"&lt;i&gt;\"</i></td><td><textarea name='instructions' rows='10' cols='40'>To enter text, click or tap any letter in the alphabet grid to add it to the active block. The active block will automatically update to the next block in the word.<br><br>Click or tap on any block to make it the active block. The relevant across and/or down clue(s) will also be highlighted.<br><br>Click or tap any clue to move to that word.<br><br>REVEAL LETTER: This will insert the correct letter into the current block.<br><br>REVEAL WORD: This will insert the correct letters into all blocks in the current word.<br><br>CHECK ANSWERS: If you have made any mistakes or left any blocks empty, they will be highlighted in red. You will be able to correct these mistakes.<br><br>DESKTOP USERS: You can also use the keyboard to enter letters. Use &lt;Backspace&gt; or &lt;Delete&gt; to clear the current box. You can navigate through the grid using the arrow keys and &lt;Page Up&gt; to get to the next clue and &lt;Page Down&gt; to get to the previous clue.</textarea></td></tr>");
			$("#texttbl").append("<tr><td>Reset instructions:</td><td><textarea name='reset_inst' rows='5' cols='40'>Click or tap the RESET button to clear the crossword grid and start again.</textarea></td></tr>");
			$("#texttbl").append("<tr><td>Close button:</td><td><input type='text' name='xbox' value='CLOSE' required></td></tr>");
			
			$("#clueform").append("<table id='cluetbl'><table>");
			$("#cluetbl").append("<thead><th colspan='3'>ACROSS</th><th colspan='3'>DOWN</th></thead>");
			
			console.log(noclue);
			for (x = 1; x < noclue; x++) {
				$("#cluetbl").append("<tr><td><b>" + x + "</b></td><td>" + a_clues[x] + "</td><td id='a" + x + "'></td><td><b>" + x + "</b></td><td>" + d_clues[x] + "</td><td id='d" + x + "'></td></tr>");
				if (a_clues[x] === undefined) {
					$("#a" + x).addClass("blank");	
					$("#a" + x).prev().addClass("blank");
					$("#a" + x).prev().prev().addClass("blank");
					$("#a" + x).append("<input type='text' name='aclues[]' value=''>");
				}
				else {
					$("#a" + x).append("<input type='text' name='aclues[]' required>");
				}
				if (d_clues[x] === undefined) {
					$("#d" + x).addClass("blank");
					$("#d" + x).prev().addClass("blank");
					$("#d" + x).prev().prev().addClass("blank");
					$("#d" + x).append("<input type='text' name='dclues[]' value=''>");
				}
				else {
					$("#d" + x).append("<input type='text' name='dclues[]' required>");
				}
			}
		
			$("#cluetbl").append("<tr><td colspan='6' class='blank'><textarea name='json'>" + json + "</textarea></td></tr>");
			
			$("#cluetbl").append("<tr><td colspan='6' text-align='center'><input type='submit' value='Generate'></td></tr>");
		}//end if valid

	});

//KEY PRESS
	$(document)	.keyup(function(e) {
		var el = e.keyCode;

		var r = currbox.attr("id").substr(0, currbox.attr("id").indexOf("_"));
		var c = currbox.attr("id").substr(currbox.attr("id").indexOf("_") + 1);

        //if delete
		if (el == 8 || el == 46) {
            currbox.html("");
		}

		//if letter
		if (el > 96 && el < 123) {
            el -= 32;
		}
		if (el > 64 && el < 91) {
            el = "&#" + el.toString() + ";";
            currbox.html(el);
		}

/*		//if arrow
		if (el > 36 && el < 41) {
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
					if (c < size) {
						c++;
					}
					break;
				case 40:
					if (r < size) {
						r++;
					}
			}
		}*/

		if ($("#" + r + "_" + c) !== undefined) {
            activate(r + "_" + c);
        }

	});//end KEY PRESS
		
});//end document.ready