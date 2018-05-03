<!DOCTYPE html>
<html lang="en">
    <head>
        <!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->
        <meta name="description" content="A wise discord bot.">
        <meta name="referrer" content="origin">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="author" content="Nimja.com">
        <meta property="og:title" content="Wisdom - ">
        <meta property="og:description" content="A wise discord bot.">
        <meta property="og:url" content="https://wisdom.nimja.com/"/>
        <title>Wisdom</title>
        <style>
            html {
                font-family: arial;
                text-align: center;
            }
            .buttons {
                margin: auto;
            }
            .buttons button{
                background: #405299;
                color: white;
                border: 1px solid #161c34;
                font-size: 150%;
                margin: 5px;
                padding: 10px;
            }
            #output {
                text-align: center;
                padding: 10px;
                font-size: 150%;
                margin: 20px 20%;
            }
        </style>
    </head>
    <body>
        <h1>Example page for Wisdom</h1>
        <h2>A wise Discord Bot. <a href="https://github.com/Nimja/Wisdom#readme">View on GitHub</a></h2>
        <div class="buttons">
            <?php
            $buttons = [];
            $script = [
                file_get_contents('speak/index.js'),
                'var speak = new Speak();'
            ];
            $dir = 'speak/dicts/';
            foreach (scandir($dir) as $file) {
                if ($file == '.' || $file === '..') {
                    continue;
                }
                $name = pathinfo($file, PATHINFO_FILENAME);
                $ucName = ucfirst($name);
                $buttons[] = "<button data-dict=\"{$name}\" class=\"button\">{$ucName}</button>";
                $script[] = "speak.dicts.{$name} = " . file_get_contents($dir . $file) . ";";
            }
            echo implode(PHP_EOL, $buttons);
            ?>
        </div>
        <div id="output">Click a button above!</div>
        <script>
<?= implode(PHP_EOL . PHP_EOL, $script); ?>

            var buttons = document.getElementsByClassName("button");
            var output = document.getElementById("output");
            // Generate the output and put it in the output.
            var updateOutput = function (evt) {
                evt.preventDefault();
                var dict = this.dataset.dict;
                var sentence = speak.getSentence(dict, '<b>Name</b>');
                output.innerHTML = sentence.replace(/\n/g, '<br />');
            };
            // Add event listeners.
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', updateOutput, false);
            }
        </script>
        <div class="copyright">
            Copyright 2018 &copy; <a href="https://nimja.com">Nimja.com</a><br />
        </div>
    </body>
</html>
