[% USE String %]
[% explanation = String.new( "bet/explanation/details/$form_name" ) %]
[% CALL explanation.append(".html.tt") %]

[% winning = String.new( "bet/explanation/winning/$form_name" ) %]
[% CALL winning.append(".html.tt") %]

[%
    static_url = String.new(text => static_url)

    flash.risefall        = static_url.copy.append("flash/betguide-risefall.swf")
    flash.higherlower     = static_url.copy.append("flash/betguide-higherlower.swf")
    flash.touchnotouch    = static_url.copy.append("flash/betguide-touchnotouch.swf")
    flash.staysinout      = static_url.copy.append("flash/betguide-staysinout.swf")
    flash.endsinout       = static_url.copy.append("flash/betguide-endsinout.swf")
    flash.updown          = static_url.copy.append("flash/betguide-updown.swf")
    flash.digits          = other_static_url.copy.append("flash/betguide-runbet-lucky10.swf")
%]

<div class='grd-grid-12 grd-parent'>

    [% IF show_flash %]
        [% IF flash.$form_name %]
        <div class='grd-grid-4 grd-grid-mobile-12'>
            <div id="bet-guide-demo">
                <object width="245" height="160" type="application/x-shockwave-flash" data="[% flash.$form_name %]">
                    <param name="movie" value="[% flash.$form_name %]" />
                    <param name="menu" value="false" />
                    <param name="quality" value="high" />
                    <param name="bgcolor" value="#FFFFFF" />
                    <param name="wMode" value="transparent" />
                </object>
            </div>
        </div>
        [% END %]
    [% END %]

    [% IF show_winning && show_flash && flash.$form_name  %]
        <div class='grd-grid-8 grd-grid-mobile-12'>
            <h4>
                [% l("Winning the contract") %]
            </h4>
            [% INCLUDE "$winning" %]
        </div>
    [% ELSIF show_winning %]
        <div class='grd-grid-12'>
            <h4>
                [% l("Winning the contract") %]
            </h4>
            [% INCLUDE "$winning" %]
        </div>
    [% END %]
    [% IF show_explain %]
    <div class='grd-grid-12'>
        <div id='explanation-content'>
            [% INCLUDE "$explanation" %]
        </div>
    </div>
    [% END %]
</div><!-- grd-parent closes -->
