<span class="grd-grid-5 form_label">
    <select id="submarket" name="submarket" class="selectMarketType">
        [% FOREACH submarket IN submarket_options %]
            <option value="[% submarket.name %]" [% IF submarket.name == selected_submarket %] selected="selected" [% END %]>[% submarket.translated_name %]</option>
        [% END %]
    </select>
</span>
<span class='grd-grid-7'>
    <select id="bet_underlying" name="underlying_symbol">
        [% FOREACH underlying IN underlying_options %]
            <option [% IF underlying.class %] class="[% underlying.class %]" [% END %] value="[% underlying.value %]" [% IF underlying.disabled %] disabled="disabled" [% END %] [% IF underlying.value == selected_underlying %] selected="selected" [% END %]>[% underlying.text %]</option>
        [% END %]
    </select>
    [% IF info_link == 'random' %]
    <a class="pjaxload unicode-info-icon" id="randomtip" href="[% request.url_for('/get-started/random-markets') %]">?</a>
    [% ELSIF info_link == 'smarties' %]
    <a class="pjaxload unicode-info-icon" id="smarttip" href="[% request.url_for('/smart-indices') %]">?</a>
    [% END %]
</span>
<input type="hidden" id="pip_size" value="[% pip_size %]">
<input type="hidden" id="decimal_places" value="[% decimal_places %]">
<input type="hidden" id="selected_submarket" value="[% selected_submarket %]">
