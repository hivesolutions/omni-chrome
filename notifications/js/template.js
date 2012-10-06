// Hive Colony Framework
// Copyright (C) 2008-2012 Hive Solutions Lda.
//
// This file is part of Hive Colony Framework.
//
// Hive Colony Framework is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Hive Colony Framework is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Hive Colony Framework. If not, see <http://www.gnu.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2012 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

/**
 * Normal state for the template engin where it is trying to find new tags.
 */
var TEMPLATE_ENGINE_NORMAL = 1;

/**
 * State where the tempalte engine has just found a dollar sign and is trying to
 * open a tage with an open braces chracter.
 */
var TEMPLATE_ENGINE_DOLLAR = 2;

/**
 * State when the tag has been open and the parser is trying to find the name of
 * the tag.
 */
var TEMPLATE_ENGINE_OPEN = 3;

/**
 * State for the context where the template engine is trying to find the initial
 * part of a "new" parameter inside the tag.
 */
var TEMPLATE_ENGINE_PARAMETERS = 4;

/**
 * State when a new parameter has just been found and the parser is trying to
 * find the limit of it.
 */
var TEMPLATE_ENGINE_PARAMETER = 5;

/**
 * State when the initial part of a value has been found and the parser is
 * trying to find the end of the value.
 */
var TEMPLATE_ENGINE_PARAMETER_VALUE = 6;

/**
 * State where the initial part of a string based value has been found and the
 * end of string is trying to be found for complete string value assert.
 */
var TEMPLATE_ENGINE_PARAMETER_VALUE_STRING = 7;

/**
 * The template node to be used as the root node os the node structure.
 */
var TEMPLATE_NODE_ROOT = 1;

/**
 * The template node representing a "simple" text context.
 */
var TEMPLATE_NODE_TEXT = 2;

/**
 * The template node representing a single open and closing context.
 */
var TEMPLATE_NODE_SINGLE = 3;

/**
 * The template node representing an open (tag) context.
 */
var TEMPLATE_NODE_OPEN = 4;

/**
 * The template node representing an close (tag) context.
 */
var TEMPLATE_NODE_CLOSE = 5;

/**
 * The template node representing an undefined context.
 */
var TEMPLATE_NODE_UNDEFINED = 6;

/**
 * The parameter of type string literal.
 */
var TEMPLATE_PARAMETER_STRING = 1;

/**
 * The parameter of type variable reference it must be dereferenced first.
 */
var TEMPLATE_PARAMETER_REFERENCE = 2;

/**
 * The parameter of type integer, number with no decimal part.
 */
var TEMPLATE_PARAMETER_INTEGER = 3;

/**
 * The parameter of type integer, number with decimal part.
 */
var TEMPLATE_PARAMETER_FLOAT = 4;

var DEFAULT_CALLBACKS = {
    textEnd : function(data, start, end) {
        console.info("textEnd :: '" + data + "'");
    },
    parameter : function(data, start, end) {
        console.info("parameter :: '" + data + "'");
    },
    parameterValue : function(data, start, end) {
        console.info("parameterValue :: '" + data + "'");
    },
    tagEnd : function(data, start, end) {
        console.info("tagEnd :: '" + data + "'");
    }
};

var TemplateEngine = function() {
};

TemplateEngine.prototype.getc = function() {
    var buffer = this.buffer;
    var position = this.position;

    if (position == buffer.length) {
        return null;
    }

    var value = buffer[position];
    this.position++;
    return value;
};

TemplateEngine.prototype.mark = function(value) {
    this.markN(value, 0);
};

TemplateEngine.prototype.markBack = function(value) {
    this.markN(value, 1);
}

TemplateEngine.prototype.markN = function(value, offset) {
    this.marks[value] = this.position - offset;
};

TemplateEngine.prototype.callbackData = function(value) {
    this.callbackDataN(value, 0);
};

TemplateEngine.prototype.callbackDataBack = function(value) {
    this.callbackDataN(value, 1);
};

TemplateEngine.prototype.callbackDataN = function(value, offset) {
    var callback = this.callbacks[value];
    if (!callback) {
        return;
    }

    var start = this.marks[value] || 0;
    var end = this.position - offset;
    var data = this.buffer.slice(start, end);

    callback.call(this.context, data, start, end);
};

TemplateEngine.prototype.callback = function(value) {
    var callback = this.callbacks[value];
    if (!callback) {
        return;
    }

    callback.call(this.context);
};

TemplateEngine.prototype.process = function(template, options) {
    // default the options value to an empty structrue
    // to avoid undefined references
    options = options || {}

    this.buffer = template;
    this.position = 0;
    this.marks = {};
    this.callbacks = options.callbacks || DEFAULT_CALLBACKS;
    this.context = options.context || this;

    var ahead;
    var current;
    var aheadSet = 0;
    var state = TEMPLATE_ENGINE_NORMAL;

    // iterates continuously too run the parser
    // over the complete set of file contents
    while (true) {
        // in case the look ahead mode is set, should
        // read from the look ahead instead of the normal
        // file reading
        if (aheadSet) {
            // sets the current read character as the look
            // ahead character and unsets the ahead set flag
            current = ahead;
            aheadSet = 0;
        }
        // otherwise it must be a normal reading
        else {
            // retrieves the current character
            // from the file stream
            current = this.getc();
        }

        // in case the end of file has been found, or
        // the file size is zero (breaks)
        if (current == null) {
            // breaks the cycle (end of parsing)
            break;
        }

        // switches over the state to determine the appropriate
        // handling to be made for the current character
        switch (state) {
            case TEMPLATE_ENGINE_NORMAL :
                if (current == '$') {
                    state = TEMPLATE_ENGINE_DOLLAR;
                }

                break;

            case TEMPLATE_ENGINE_DOLLAR :
                if (current == '{') {
                    // marks the tag element and calls the text end and tag
                    // begin callbacks
                    this.mark("tagName");
                    this.markN("tagEnd", 2);
                    this.callbackDataN("textEnd", 2);
                    this.callback("tagBegin");

                    // changes the state of the parser to open (tag open)
                    state = TEMPLATE_ENGINE_OPEN;

                    // reads ahead and sets the ahead set flag
                    ahead = this.getc();
                    aheadSet = 1;

                    if (ahead == '/') {
                        this.callback("tagCloseBegin");
                        aheadSet = 0;
                    }
                } else {
                    // resets the state to the "normal"
                    state = TEMPLATE_ENGINE_NORMAL;
                }

                break;

            case TEMPLATE_ENGINE_OPEN :
                if (current == '/') {
                    // reads ahead and sets the ahead set flag
                    ahead = this.getc();
                    aheadSet = 1;

                    if (ahead == '}') {
                        state = TEMPLATE_ENGINE_NORMAL;

                        // unsets the ahead set flag
                        aheadSet = 0;

                        // marks the text end
                        this.mark("textEnd");

                        // calls the tag end and text begin callbacks
                        this.callbackData("tagEnd");
                        this.callback("textBegin");

                        break;
                    }
                }

                if (current == '}') {
                    state = TEMPLATE_ENGINE_NORMAL;

                    this.mark("textEnd");

                    // calls the tag end and text begin callbacks
                    this.callbackData("tagEnd");
                    this.callback("textBegin");

                    break;
                }

                if (current == ' ') {
                    // calls the tag name callback
                    this.callbackDataBack("tagName");

                    // changes the state of the template engine to parametrs
                    // (parameters finding)
                    state = TEMPLATE_ENGINE_PARAMETERS;
                }

                break;

            case TEMPLATE_ENGINE_PARAMETERS :
                if (current == '/') {
                    ahead = this.getc();
                    aheadSet = 1;

                    if (ahead == '}') {
                        state = TEMPLATE_ENGINE_NORMAL;
                        aheadSet = 0;

                        this.mark("textEnd");

                        // calls the tag end and text begin
                        // callbacks
                        this.callbackData("tagEnd");
                        this.callback("textBegin");

                        break;
                    }
                }

                if (current == '}') {
                    state = TEMPLATE_ENGINE_NORMAL;

                    this.mark("textEnd");

                    // calls the tag end and text begin callbacks
                    this.callbackData("tagEnd");
                    this.callback("textBegin");

                    break;
                }

                if (current != ' ') {
                    this.markBack("parameter");

                    state = TEMPLATE_ENGINE_PARAMETER;
                }

                break;

            case TEMPLATE_ENGINE_PARAMETER :
                if (current == '/') {
                    ahead = this.getc();
                    aheadSet = 1;

                    if (ahead == '}') {
                        state = TEMPLATE_ENGINE_NORMAL;
                        aheadSet = 0;

                        this.mark("textEnd");

                        // calls the tag end and text begin
                        // callbacks
                        this.callbackData("tagEnd");
                        this.callback("textBegin");

                        break;
                    }
                }

                if (current == '}') {
                    state = TEMPLATE_ENGINE_NORMAL;

                    this.mark("textEnd");

                    // calls the tag end and text begin callbacks
                    this.callbackData("tagEnd");
                    this.callback("textBegin");

                    break;
                }

                if (current == '=') {
                    // calls the parameter callback and marks the template
                    // engine parameter value
                    this.callbackDataBack("parameter");
                    this.mark("parameterValue");

                    state = TEMPLATE_ENGINE_PARAMETER_VALUE;
                }

                break;

            case TEMPLATE_ENGINE_PARAMETER_VALUE :
                if (current == '/') {
                    ahead = this.getc();
                    aheadSet = 1;

                    if (ahead == '}') {
                        state = TEMPLATE_ENGINE_NORMAL;
                        aheadSet = 0;

                        this.mark("textEnd");

                        // calls the tag end and text begin callbacks
                        this.callbackData("tagEnd");
                        this.callback("textBegin");

                        break;
                    }
                }

                if (current == '}') {
                    state = TEMPLATE_ENGINE_NORMAL;

                    this.mark("textEnd");

                    // calls the th parameter value, tag end and text begin
                    // callbacks
                    this.callbackDataBack("parameterValue");
                    this.callbackData("tagEnd");
                    this.callback("textBegin");

                    break;
                }

                if (current == '\"') {
                    state = TEMPLATE_ENGINE_PARAMETER_VALUE_STRING;
                } else if (current == ' ') {
                    // calls the parameter value callback
                    this.callbackDataBack("parameterValue");

                    state = TEMPLATE_ENGINE_PARAMETERS;
                }

                break;

            case TEMPLATE_ENGINE_PARAMETER_VALUE_STRING :
                if (current == '\"') {
                    // calls the parameter value callback
                    this.callbackData("parameterValue");

                    state = TEMPLATE_ENGINE_PARAMETERS;
                }

                break;
        }
    }

    // in case the current state is engine
    // normal (there must be text to be flushed)
    if (state == TEMPLATE_ENGINE_NORMAL) {
        // calls the text end callback
        this.callbackData("textEnd");
    }
};

var TemplateHandler = function() {
    this.names = {}
};

TemplateHandler.prototype.getValue = function() {
    return this.stringValue;
};

TemplateHandler.prototype.assign = function(name, value) {
    this.names[name] = value;
};

TemplateHandler.prototype.resolve = function(parameter) {
    var value = parameter.value;

    switch (parameter.type) {
        case TEMPLATE_PARAMETER_REFERENCE :
            value = this._get(value);
            break;
    }
    ;

    return value;
};

TemplateHandler.prototype._get = function(name) {
    var names = name.split(".");
    var current = this.names;

    for (var index = 0; index < names.length; index++) {
        var _name = names[index];
        current = current[_name];
    }

    return current;
};

TemplateHandler.prototype.eval = function(item, value, operator) {
    var result = false;

    switch (operator.value) {
        case "eq" :
            result = item === value;
            break;

        case "neq" :
            result = item !== value;
            break;
    }

    return result;
};

TemplateHandler.prototype.process = function(template) {
    this.stringBuffer = [];
    this.nodes = [];
    this.contexts = [];

    // creates the node that will serve as the root node
    // for the tree traversing and then sets it as the
    // current node in iteration
    var rootNode = new TemplateNode(TEMPLATE_NODE_ROOT);
    this.currentNode = rootNode;

    // creates the configuration map to be used for the
    // engine to call the callback methods
    var configuration = {
        callbacks : {
            textBegin : this.onTextBegin,
            textEnd : this.onTextEnd,
            tagBegin : this.onTagBegin,
            tagCloseBegin : this.onTagCloseBegin,
            tagEnd : this.onTagEnd,
            tagName : this.onTagName,
            parameter : this.onParameter,
            parameterValue : this.onParameterValue
        },
        context : this
    };

    // creates a new template engine structure and runs
    // the process command on top of the template string
    var engine = new TemplateEngine();
    engine.process(template, configuration);

    // traverses the top level root node children to create
    // the complete string buffer structure
    this.traverseNode(rootNode);

    // joins the resulting string value into the "final" string
    // value resulting from the template parsing
    this.stringValue = this.stringBuffer.join("");
};

TemplateHandler.prototype.openContext = function() {
    this.contexts.push(this.currentNode);
    this.currentNode = this.temporaryNode;
};

TemplateHandler.prototype.closeContext = function() {
    this.currentNode = this.contexts.pop();
};

TemplateHandler.prototype.onTextBegin = function() {
};

TemplateHandler.prototype.onTextEnd = function(data, start, end) {
    // creates a new template node and sets the template
    // node as the temporary node in the template handler
    var node = new TemplateNode(TEMPLATE_NODE_TEXT);
    this.temporaryNode = node;

    // sets the current data as the name of the node that
    // has just been created
    node.name = data;

    // adds the temporary node to the current list of nodes
    // in the template handler and to the chilren list of
    // the current node
    this.nodes.push(node);
    this.currentNode.children.push(node);
};

TemplateHandler.prototype.onTagBegin = function() {
    // creates a new template node and sets the template
    // node as the temporary node in the template handler
    var node = new TemplateNode(TEMPLATE_NODE_OPEN);
    this.temporaryNode = node;
};

TemplateHandler.prototype.onTagCloseBegin = function() {
    // sets the temporary node type as close
    this.temporaryNode.type = TEMPLATE_NODE_CLOSE;
};

TemplateHandler.prototype.onTagEnd = function(data, start, end) {
    // retrieves the current node to be used as the backup
    // value for the (pvevious) current node before context
    // change actions
    var currentNode = this.currentNode;

    // in case the node does contain the closing
    // symbol at the final part of the tag (assumes single node)
    if (data[data.length - 2] == '/') {
        // sets the temporary node type as single
        this.temporaryNode.type = TEMPLATE_NODE_SINGLE;
    }

    // switches over the temporary node type
    switch (this.temporaryNode.type) {
        case TEMPLATE_NODE_OPEN :
            // opens a new context for the current node
            this.openContext();

            // breaks the switch
            break;

        case TEMPLATE_NODE_CLOSE :
            // closes the current context (node closed)
            this.closeContext();

            // breaks the switch
            break;
    }

    // in case the temporary node is of type close, no need
    // to process it (returns immediately)
    if (this.temporaryNode.type == TEMPLATE_NODE_CLOSE) {
        return;
    }

    // adds the temporary node to the current list of nodes
    // in the template handler and to the chilren list of
    // the temporary node
    currentNode.children.push(this.temporaryNode);
    this.nodes.push(this.temporaryNode);
};

TemplateHandler.prototype.onTagName = function(data, start, end) {
    this.temporaryNode.name = data;
};

TemplateHandler.prototype.onParameter = function(data, start, end) {
    // creates the structure that will hold the complete
    // parameter data, including the value (default to null)
    var parameter = {
        name : data,
        value : null,
        type : null
    }

    this.temporaryNode.temporaryParameter = parameter;
    this.temporaryNode.parameters.push(parameter);
    this.temporaryNode.parametersMap[data] = parameter;
};

TemplateHandler.prototype.onParameterValue = function(data, start, end) {
    var temporaryParameter = this.temporaryNode.temporaryParameter;

    var first = data[0];
    var code = first.charCodeAt(0);

    if (first == '"') {
        temporaryParameter.value = data.slice(1, data.length - 1);
        temporaryParameter.type = TEMPLATE_PARAMETER_STRING;
    } else if (code > 0x2f && code < 0x58) {
        temporaryParameter.value = parseInt(data);
        temporaryParameter.type = TEMPLATE_PARAMETER_INTEGER;
    } else {
        temporaryParameter.value = data;
        temporaryParameter.type = TEMPLATE_PARAMETER_REFERENCE;
    }
};

TemplateHandler.prototype.traverseNode = function(node) {
    // switches over the type of node to be traversed,
    // to print the correct value
    switch (node.type) {
        case TEMPLATE_NODE_ROOT :
            // traverses all the nodes in the root node
            this.traverseNodes(node);

            // breaks the switch
            break;

        case TEMPLATE_NODE_TEXT :
            // adds the node name (text value) to the
            // string buffer
            this.stringBuffer.push(node.name);

            // breaks the switch
            break;

        case TEMPLATE_NODE_SINGLE :
        case TEMPLATE_NODE_OPEN :
            // retrievs the method to be used in the current
            // traverse operation and executes it with the node
            var method = this["traverse_" + node.name];
            method.call(this, node);

            // breaks the switch
            break;
    }
};

TemplateHandler.prototype.traverseNodes = function(node) {
    for (var index = 0; index < node.children.length; index++) {
        var child = node.children[index];
        this.traverseNode(child);
    }
};

TemplateHandler.prototype.traverse_out = function(node) {
    // retrieves the value parameter from the
    // current node to be used to "select" the
    // appropriate output data to be added to
    // the string buffer
    var value = node.getParameter("value");
    var _value = value.value;

    switch (value.type) {
        case TEMPLATE_PARAMETER_STRING :
            this.stringBuffer.push(_value);
            break;

        case TEMPLATE_PARAMETER_REFERENCE :
            _value = this._get(_value);
            var valueS = String(_value);
            this.stringBuffer.push(valueS);
            break;

        case TEMPLATE_PARAMETER_INTEGER :
        case TEMPLATE_PARAMETER_FLOAT :
            var valueS = String(_value);
            this.stringBuffer.push(valueS);
            break;
    }
};

TemplateHandler.prototype.traverse_foreach = function(node) {
    // retrieves the various parameters to be used
    // for the processing of the foreach operation
    var item = node.getParameter("item");
    var from = node.getParameter("from");

    // resolves the from value into the
    // appropriate value
    var value = this.resolve(from);

    for (index = 0; index < value.length; index++) {
        var _value = value[index];
        this.assign(item.value, _value);
        this.traverseNodes(node);
    }
};

TemplateHandler.prototype.traverse_if = function(node) {
    // retrieves the various parameters to be used
    // for the processing of the if operation
    var item = node.getParameter("item");
    var value = node.getParameter("value");
    var operator = node.getParameter("operator");

    // resolves both the item an the value into the
    // appropriate values
    var _item = this.resolve(item);
    var _value = this.resolve(value);

    // evaluates the item and th value using the
    // provided operator and updates the if result
    // context value with it
    var result = this.eval(_item, _value, operator)
    this.assign("if_result", result);

    for (var index = 0; index < node.children.length; index++) {
        var child = node.children[index];

        var _break = false;
        result = this._get("if_result");

        // switches over the type of node to be traversed,
        // to print the correct value
        switch (child.type) {
            case TEMPLATE_NODE_TEXT :
                // adds the node name (text value) to the
                // string buffer
                result && this.stringBuffer.push(child.name);

                // breaks the switch
                break;

            case TEMPLATE_NODE_SINGLE :
            case TEMPLATE_NODE_OPEN :
                _break = result;

                // retrievs the method to be used in the current
                // traverse operation and executes it with the node
                var method = this["traverse_" + child.name];
                !result && method.call(this, child);

                // breaks the switch
                break;
        }

        // in case the break flag is set must break the
        // loop, no more nodes to be traversed
        if (_break) {
            break;
        }
    }
};

TemplateHandler.prototype.traverse_elif = function(node) {
    // retrieves the various parameters to be used
    // for the processing of the if operation
    var item = node.getParameter("item");
    var value = node.getParameter("value");
    var operator = node.getParameter("operator");

    // resolves both the item an the value into the
    // appropriate values
    var _item = this.resolve(item);
    var _value = this.resolve(value);

    // evaluates the item and th value using the
    // provided operator and updates the if result
    // context value with it
    var result = this.eval(_item, _value, operator)
    this.assign("if_result", result);
};

TemplateHandler.prototype.traverse_else = function(node) {
    this.assign("if_result", true);
};

var TemplateNode = function(type) {
    this.type = type;
    this.children = [];
    this.parameters = [];
    this.parametersMap = {}
};

TemplateNode.prototype.getParameter = function(name) {
    return this.parametersMap[name];
};
