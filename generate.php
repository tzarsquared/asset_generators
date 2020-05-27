<!doctype html>
<html>
	<head>
	<meta charset="UTF-8">
	<title>Crossword generator</title>
	</head>

	<body>
    	<?php
			function xcopy($source, $dest, $permissions = 0755) {
			    // Check for symlinks
			    if (is_link($source)) {
			        return symlink(readlink($source), $dest);
			    }

			    // Simple copy for a file
			    if (is_file($source)) {
			        return copy($source, $dest);
			    }

			    // Make destination directory
			    if (!is_dir($dest)) {
			        mkdir($dest, $permissions);
			    }

			    // Loop through the folder
			    $dir = dir($source);
			    while (false !== $entry = $dir->read()) {
		        // Skip pointers
		    	    if ($entry == '.' || $entry == '..') {
			            continue;
		       		 }

					// Deep copy directories
	       			xcopy("$source/$entry", "$dest/$entry", $permissions);
			    }

			    // Clean up
			    $dir->close();
	    		return true;
			}
		
			//Create container folder
			if (xcopy("resources", "files/" . $_POST["id"])) {
				echo "Folder created.<br>";
			}
			else echo "Error creating folder.<br>";
		
			//JSON file
			$json_grid = 	fopen("files/" . $_POST["id"] . "/data/xword.json", "w") 
							or die("Error creating crossword JSON file");
			fwrite($json_grid, $_POST["json"]);
			echo "Crossword data file created.<br>";
			
			//GENERATE CLUES JSON FILE
			$json_file = 	fopen("files/" . $_POST["id"] . "/data/clues.json", "w") 
							or die("Error creating clues JSON file");
			
			$line = "[\n\t{\n\t\t\"across\" : [\n";
			fwrite($json_file, $line);
			
			//foreach in across
			for ($x = 0; $x <= count($_POST["aclues"]); $x++) {
				$line = "\t\t\t\t\t\t\"" . $_POST["aclues"][$x] . "\"";
				if ($x < count($_POST["aclues"])) $line = $line . ",";
				$line = $line . "\n";
				fwrite($json_file, $line);
			}
			
			$line = "\t\t\t\t\t],\n\t\t\"down\" :\t[\n";
			fwrite($json_file, $line);
			
			//foreach in down
			for ($x = 0; $x <= count($_POST["dclues"]); $x++) {
				$line = "\t\t\t\t\t\t\"" . $_POST["dclues"][$x] . "\"";
				if ($x < count($_POST["dclues"])) $line = $line . ",";
				$line = $line . "\n";
				fwrite($json_file, $line);
			}
			
			$line = "\t\t\t\t\t]\n\t}\n]";
			fwrite($json_file, $line);
			
			echo "Clues data file created.<br>";
			
			//GENERATE TEXT JSON FILE
			$json_text = 	fopen("files/" . $_POST["id"] . "/data/text.json", "w") 
							or die("Error creating text JSON file");
			
			$line = "[\n\t{\n\t\t\"title\" : \"" . $_POST["title"] . "\",\n\t\t";
			fwrite($json_text, $line);
			
			$line = "\"check\" : \"" . $_POST["check"] . "\",\n\t\t";
			fwrite($json_text, $line);
			
			$line = "\"reset\" : \"" . $_POST["reset"] . "\",\n\t\t";
			fwrite($json_text, $line);
			
			$line = "\"word\" : \"" . $_POST["word"] . "\",\n\t\t";
			fwrite($json_text, $line);
			
			$line = "\"letter\" : \"" . $_POST["letter"] . "\",\n\t\t";
			fwrite($json_text, $line);
			
			$line = "\"help\" : \"" . $_POST["help"] . "\",\n\t\t";
			fwrite($json_text, $line);
			
			$line = "\"xbox\" : \"" . $_POST["xbox"] . "\",\n\t\t";
			fwrite($json_text, $line);
			
			$line = "\"instructions\" : \"" . $_POST["instructions"] . "\",\n\t\t";
			fwrite($json_text, $line);
			
			$line = "\"reset_inst\" : \"" . $_POST["reset_inst"] . "\"\n\t}\n]";
			fwrite($json_text, $line);
			
			echo "Text data file created.<br>";
			
			//Create ZIP file
			$rootPath = realpath("files/" . $_POST["id"]);

			// Initialize archive object
			$zip = new ZipArchive();
			$zip->open("files/" . $_POST["id"] . ".zip", ZipArchive::CREATE | ZipArchive::OVERWRITE);

			// Create recursive directory iterator
			$files = new RecursiveIteratorIterator(
			    	new RecursiveDirectoryIterator($rootPath),
				    RecursiveIteratorIterator::LEAVES_ONLY
			);

			foreach ($files as $name => $file)
			{
			    // Skip directories (they would be added automatically)
			    if (!$file->isDir())
			    {
					// Get real and relative path for current file
					$filePath = $file->getRealPath();
					$relativePath = substr($filePath, strlen($rootPath) + 1);

					// Add current file to archive
					$zip->addFile($filePath, $relativePath);
			    }
			}

			$zip->close();
		
			echo "ZIP file created.<br>";
			echo "<a href=\"files/" . $_POST["id"] . ".zip\">Download here</a>.";
		
			//clean up (delete folder)
			$dir = "files/" . $_POST["id"];
			$it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
			$files = new RecursiveIteratorIterator(	$it,
													RecursiveIteratorIterator::CHILD_FIRST);
			foreach($files as $file) {
		    	if ($file->isDir()){
		    	    rmdir($file->getRealPath());
		    	} else {
		    	    unlink($file->getRealPath());
		    	}
			}
			rmdir($dir);
		?>
	</body>
</html>
