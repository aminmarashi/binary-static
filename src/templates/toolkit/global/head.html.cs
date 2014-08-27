<!DOCTYPE html>
[% IF appcache_manifest %]
<html manifest='[%= request.url_for(iso639a_language _ "_appcache.appcache") =%]'>
[% ELSE %]
<html>
[% END %]
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta http-equiv="Content-Language" content="[%= iso639a_language =%]" />
        <meta name="description" content="
        [%= l('[_1] gives everyone an easy and exciting way to participate in the financial markets. Trade with as little as $1 USD on major currencies, indices, commodities and stocks.', broker_name) =%]" />
        <meta name="keywords" content="
                [%= l('binary options, binary option, forex trading, online trading, financial trading, financial trading binary option, binary trading, index trading, trading indices, forex trades, trading commodities, forex trading market, practice trading, practice binary trading, tick trade, virtual money trading, trading forex stocks, binary trading, binary bet, binary online bet, binary options trading platform, digital options, trading stocks') =%]" />
        <meta name="author" content="[%= broker_name =%]" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

<<<<<<< HEAD:src/templates/toolkit/global/head.tt
        [%= FOREACH css_file IN css_files =%]
            <link rel="stylesheet" href="[%= css_file =%]">
        [% END %]


        [% INCLUDE global/javascripts.tt
=======
        [% INCLUDE global/javascripts.html.tt
>>>>>>> 3b6dd16df8c1461bc280bfac254199ed4eb34861:src/templates/toolkit/global/head.html.tt
            javascript=javascript
        %]
        <script>
            function loadCss(url, absolute) {
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                if(absolute) {
                  link.href = url;
                } else {
                  link.href = '[%= other_static_cdn =%]/'+url;
                }
                document.getElementsByTagName("head")[0].appendChild(link);
            }

            [%= FOREACH css_file IN css_files =%]
                loadCss('[%= css_file =%]', true);
            [% END %]
        </script>
        <title>[%= broker_name =%] - [%= title =%]</title>
        <link rel="SHORTCUT ICON" href="[%= icon_url =%]" />
    </head>
