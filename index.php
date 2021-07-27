<?php $package = json_decode(file_get_contents('package.json')); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->
    <meta name="description" content="<?= $package->description ?>">
    <meta name="referrer" content="origin">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="<?= $package->author ?>">
    <meta property="og:title" content="<?= $package->name ?> - Example page">
    <meta property="og:description" content="<?= $package->description ?>">
    <meta property="og:url" content="<?= $package->homepage ?>" />
    <title><?= $package->name ?> - Example Page</title>
    <style>
        html {
            font-family: arial;
            text-align: center;
        }

        .buttons {
            margin: 20px auto;
            width: 720px;
        }

        .buttons .group {
            float: left;
            border: 1px solid #161c34;
            border-radius: 5px;
            background: #eee;
            margin: 5px;
        }

        .buttons button {
            background: #405299;
            color: white;
            border: 1px solid #161c34;
            border-radius: 5px;
            font-size: 125%;
            margin: 5px;
            padding: 5px;
            width: auto;
            display: block;
        }

        #count {
            border: 1px solid #161c34;
            border-radius: 5px;
            font-size: 125%;
            padding: 10px;
            width: 45px;
        }

        #output {
            text-align: center;
            padding: 10px;
            font-size: 125%;
            margin: 20px auto;
            width: 720px;
            border: 1px solid #161c34;
            border-radius: 5px;
        }

        @media only screen and (max-width: 750px) {
            .buttons {
                margin: 20px 20px;
                width: auto;
            }

            #output {
                margin: 20px 20px;
                width: auto;
            }
        }
    </style>
</head>

<body>
    <h1><?= $package->name ?> - v<?= $package->version ?> - Example page</h1>
    <h2><?= $package->description ?><br /><a href="https://github.com/Nimja/Wisdom#readme">Source on GitHub</a></h2>
    <div class="buttons">
        <?php
        function importScript($file)
        {
            $contents = file_get_contents("wisdom/speak/{$file}.js");
            $contents = preg_replace("/^.*NODEONLY/m", '', $contents);
            return $contents;
        }
        $script = [
            importScript('array'),
            importScript('dict'),
            importScript('speak'),
            'var speak = new Speak();'
        ];
        $dir = 'wisdom/dicts/';
        $groups = [];
        foreach (scandir($dir) as $file) {
            if ($file == '.' || $file === '..') {
                continue;
            }
            $name = pathinfo($file, PATHINFO_FILENAME);
            $parts = explode('_', $name);
            $ucName = ucfirst(end($parts));
            $group = reset($parts);
            if (!key_exists($group, $groups)) {
                $groups[$group] = [];
            }

            $groups[$group][] = "<button data-dict=\"{$name}\" class=\"button\">{$ucName}</button>";
            $script[] = "speak.dicts.{$name} = new SpeakDict(" . file_get_contents($dir . $file) . ");";
        }
        foreach ($groups as $buttons) {
            echo '<div class="group">' . implode(PHP_EOL, $buttons) . '</div>' . PHP_EOL;
        }
        ?>
        <div style="clear: both;"></div>
        <b>X</b>
        <input type="number" id="count" value="1" min="1" max="50" />
    </div>
    <div id="output">Click a button above!</div>
    <script>
        <?= implode(PHP_EOL . PHP_EOL, $script); ?>

        var buttons = document.getElementsByClassName("button");
        var output = document.getElementById("output");
        var max = 1;
        // Generate the output and put it in the output.
        var updateOutput = function(evt) {
            evt.preventDefault();
            var dict = this.dataset.dict;
            var results = [];
            for (var i = 0; i < max; i++) {
                var sentence = speak.getSentence(dict, '<b>Name</b>');
                results.push(sentence.replace(/\n/g, '<br />'));
            }
            output.innerHTML = results.join('<br /><br />');
        };
        // Add event listeners.
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', updateOutput, false);
        }
        document.getElementById("count").addEventListener(
            'change',
            function() {
                max = Math.max(1, Math.min(50, parseInt(this.value)));
                this.value = max;
            }
        );
    </script>
    <div class="copyright">
        Copyright 2018-2021 &copy; <a href="https://nimja.com">Nimja.com</a><br />
    </div>
</body>

</html>