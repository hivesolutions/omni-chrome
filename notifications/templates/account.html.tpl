<div>
    <h1>All Notifications</h1>
    <ul class="panel-options">
        ${foreach item=option from=options}
            <li data-edit="1">
                <div class="key">${out value=option.key /}</div>
                <div class="value">${out value=option.value /}</div>
                <div class="clear"></div>
            </li>
        ${/foreach}
        <li data-edit="1">
            <div class="key">Photos</div>
            <div class="value">120</div>
            <div class="clear"></div>
            <ul class="panel-sub-options">
                <li data-edit="1">
                    <div class="key">Tags you in a comment</div>
                    <div class="value">
                        <input type="checkbox" class="check-field" value="1" data-checked="1" />
                    </div>
                    <div class="clear"></div>
                </li>
                <li data-edit="1">
                    <div class="key">Tags one of your photos</div>
                    <div class="value">
                        <input type="checkbox" class="check-field" value="1" data-checked="1" />
                    </div>
                    <div class="clear"></div>
                </li>
                <li data-edit="1">
                    <div class="key">Someone sells a thing for more than USD 1000</div>
                    <div class="value">
                        <input type="checkbox" class="check-field" value="1" data-checked="1" />
                    </div>
                    <div class="clear"></div>
                </li>
            </ul>
            <div class="clear"></div>
        </li>
    </ul>
    <div class="button-options">
        <span class="button refresh-settings">Refresh</span>
        <span class="button clear-settings">Clear Settings</span>
    </div>
</div>
