// Hive Solutions Development
// Copyright (C) 2008-2012 Hive Solutions Lda.
//
// This file is part of Hive Solutions Development.
//
// Hive Solutions Development is confidential and property of Hive Solutions Lda.,
// its usage is constrained by the terms of the Hive Solutions
// Confidential Usage License.
//
// Hive Solutions Development should not be distributed under any circumstances,
// violation of this may imply legal action.
//
// If you have any questions regarding the terms of this license please
// refer to <http://www.hive.pt/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2012 Hive Solutions Lda.
// __license__   = Hive Solutions Confidential Usage License (HSCUL)

(function(jQuery) {
    jQuery.fn.chart = function(method, options) {
        // the label font name
        var LABEL_FONT_NAME = "Rockwell";

        // the label font size
        var LABEL_FONT_SIZE = 32;

        // the label font real size (measured in "real pixels"
        var LABEL_FONT_REAL_SIZE = 24;

        // the color to be used in the axis
        var AXIS_COLOR = "#888888";

        // the color to be used in the auxiliary axis
        var AUXILIARY_AXIS_COLOR = "#222222";

        // the value circle color
        var VALUE_CIRCLE_COLOR = "#ffffff";

        // the background circle color
        var BACKGROUND_CIRCLE_COLOR = "#000000";

        // the background box color
        var BACKGROUND_BOX_COLOR = "rgba(0, 0, 0, 0.5)";

        // the chart colors
        var CHART_COLORS = ["#7452c5", "#ef6a15", "#0176ff", "#e0cf21",
                "#22b573", "#c69c6d", "#c14f53", "#f0e7d0", "#ff78ff"]

        // the number of vertical steps
        var VERTICAL_STEPS = 8;

        // the number of horizontal steps
        var HORIZONTAL_STEPS = 8;

        // the maximum value
        var MAXIMUM_VALUE = 999;

        // the minimum value
        var MINIMUM_VALUE = 0;

        // the vertical label width
        var VERTICAL_LABEL_WIDTH = 100;

        // the horizontal label height
        var HORIZONTAL_LABEL_HEIGHT = 100;

        // the label offset
        var LABEL_OFFSET = 26;

        // the margin left
        var MARGIN_LEFT = 30;

        // the margin right
        var MARGIN_RIGHT = 30;

        // the margin top
        var MARGIN_TOP = 80;

        // the margin bottom
        var MARGIN_BOTTOM = 80;

        // the box margin horizontal
        var BOX_MARGIN_HORIZONTAL = 20;

        // the box margin vertical
        var BOX_MARGIN_VERTICAL = 20;

        // the box horizontal offset
        var BOX_HORIZONTAL_OFFSET = 20;

        // the box vertical offset
        var BOX_VERTICAL_OFFSET = 20;

        // the data
        var DATA = {
            labels : [],
            horizontalLabels : [],
            values : {}
        }

        // the default values for the menu
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

        // sets the default options value
        var options = options ? options : {};

        // constructs the options
        var options = jQuery.extend(defaults, options);

        // sets the jquery matched object
        var matchedObject = this;

        /**
         * Initializer of the plugin, runs the necessary functions to initialize
         * the structures.
         */
        var initialize = function() {
            _appendHtml();
            _registerHandlers();
        };

        /**
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        var drawAxis = function(matchedObject, options) {
            // retrieves the options values
            var context = options["context"];
            var axisColor = options["axisColor"];
            var verticalLabelWidth = options["verticalLabelWidth"];
            var marginLeft = options["marginLeft"];
            var marginTop = options["marginTop"];
            var horizontalAxisSize = options["horizontalAxisSize"];
            var verticalAxisSize = options["verticalAxisSize"];

            // saves the current state
            context.save();

            // changes the context configuration
            context.strokeStyle = axisColor;

            // begins the path
            context.beginPath();

            // draws a dashed line
            context.dashedLine(marginLeft + verticalLabelWidth, marginTop,
                    marginLeft + verticalLabelWidth, marginTop
                            + verticalAxisSize, [8, 10]);

            // draws a dashed line
            context.dashedLine(marginLeft + verticalLabelWidth, marginTop
                            + verticalAxisSize, marginLeft + verticalLabelWidth
                            + horizontalAxisSize, marginTop + verticalAxisSize,
                    [8, 10]);

            // strokes and closes the path
            context.stroke();
            context.closePath();

            // restores the state
            context.restore();
        };

        var drawAuxiliaryAxis = function(matchedObject, options) {
            // retrieves the options values
            var context = options["context"];
            var auxiliaryAxisColor = options["auxiliaryAxisColor"];
            var horizontalSteps = options["horizontalSteps"];
            var verticalSteps = options["verticalSteps"];
            var horizontalLabelHeight = options["horizontalLabelHeight"];
            var verticalLabelWidth = options["verticalLabelWidth"];
            var marginLeft = options["marginLeft"];
            var marginTop = options["marginTop"];
            var horizontalAxisSize = options["horizontalAxisSize"];
            var verticalAxisSize = options["verticalAxisSize"];

            // saves the current state
            context.save();

            // changes the context configuration
            context.strokeStyle = auxiliaryAxisColor;

            // begins the path
            context.beginPath();

            // calculates the x position increment
            var xPositionIncrement = horizontalAxisSize / (horizontalSteps - 1);

            // sets the intial current x position value
            var currentX = marginLeft + verticalLabelWidth + xPositionIncrement;

            // iterates over the range of values
            for (var index = 0; index < horizontalSteps - 1; index++) {
                // draws a dashed line
                context.dashedLine(currentX, marginTop, currentX, marginTop
                                + verticalAxisSize, [4, 4]);

                // increments the current x position with the x
                // position increment
                currentX += xPositionIncrement;
            }

            // calculates the y position increment
            var yPositionIncrement = verticalAxisSize / verticalSteps;

            // sets the initial current y position value
            var currentY = marginTop + verticalAxisSize - yPositionIncrement;

            // iterates over the range of values
            for (var index = 0; index < verticalSteps - 1; index++) {
                // draws a dashed line
                context.dashedLine(marginLeft + verticalLabelWidth, currentY,
                        marginLeft + verticalLabelWidth + horizontalAxisSize,
                        currentY, [4, 4]);

                // decrements the current y position with the y
                // position increment
                currentY -= yPositionIncrement;
            }

            // strokes and closes the path
            context.stroke();
            context.closePath();

            // restores the state
            context.restore();
        };

        var drawAxisLabels = function(matchedObject, options) {
            // retrieves the options values
            var context = options["context"];
            var data = options["data"];
            var labelFontRealSize = options["labelFontRealSize"];
            var horizontalAxisSize = options["horizontalAxisSize"];
            var verticalAxisSize = options["verticalAxisSize"];
            var horizontalSteps = options["horizontalSteps"];
            var verticalSteps = options["verticalSteps"];
            var maximumValue = options["maximumValue"];
            var minimumValue = options["minimumValue"];
            var stepValue = options["stepValue"];
            var verticalLabelWidth = options["verticalLabelWidth"];
            var labelOffset = options["labelOffset"];
            var marginLeft = options["marginLeft"];
            var marginTop = options["marginTop"];
            var marginBottom = options["marginBottom"];

            // calculates the x position increment
            var xPositionIncrement = horizontalAxisSize / (horizontalSteps - 1);

            // sets the intial current x position value
            var currentX = marginLeft + verticalLabelWidth;

            // iterates over the range of horizontal steps
            for (var index = 0; index < horizontalSteps - 1; index++) {
                // retreives the current horizontal label
                var horizontalLabel = data.horizontalLabels[index];

                // measures the text size to retrieve
                // the text width
                var textMetrics = context.measureText(horizontalLabel);
                var textWidth = textMetrics.width;

                // draws the current value as string
                context.fillText(horizontalLabel, currentX - (textWidth / 2),
                        marginTop + verticalAxisSize + labelOffset
                                + labelFontRealSize);

                // increments the current x position with the x
                // position increment
                currentX += xPositionIncrement;
            }

            // calculates the y position increment
            var yPositionIncrement = verticalAxisSize / verticalSteps;

            // sets the initial current y position value
            var currentY = marginTop + verticalAxisSize;

            // sets the initial current value
            var currentValue = minimumValue;

            // iterates over the range of values
            for (var index = 0; index < verticalSteps; index++) {
                // converts the current value string
                var currentValueString = String(currentValue);

                // measures the text size to retrieve
                // the text width
                var textMetrics = context.measureText(currentValueString);
                var textWidth = textMetrics.width;

                // draws the current value as string
                context.fillText(currentValueString, marginLeft
                                + verticalLabelWidth - labelOffset - textWidth,
                        currentY + Math.round(labelFontRealSize / 2));

                // drecrements the current y position with the y
                // position increment
                currentY -= yPositionIncrement;

                // increments the current value with
                // the step value
                currentValue += stepValue;
            }
        };

        var drawLines = function(matchedObject, options) {
            // retrieves the options values
            var context = options["context"];
            var data = options["data"];
            var valueCircleColor = options["valueCircleColor"];
            var backgroundCircleColor = options["backgroundCircleColor"];
            var chartColors = options["chartColors"];
            var maximumValue = options["maximumValue"];
            var minimumValue = options["minimumValue"];
            var horizontalSteps = options["horizontalSteps"];
            var verticalSteps = options["verticalSteps"];
            var verticalLabelWidth = options["verticalLabelWidth"];
            var marginLeft = options["marginLeft"];
            var marginTop = options["marginTop"];
            var horizontalAxisSize = options["horizontalAxisSize"];
            var verticalAxisSize = options["verticalAxisSize"];

            // retrieves the data values
            var dataValues = data["values"];

            // retrieves the chart colors length
            var chartColorsLength = chartColors.length;

            // saves the current state
            context.save();

            // changes the context configuration
            context.lineWidth = 8;

            // calculates the x position increment
            var xPositionIncrement = horizontalAxisSize / (horizontalSteps - 1);

            // calculates the y position increment
            var yPositionIncrement = verticalAxisSize / verticalSteps;

            // starts the values index
            var valuesIndex = 0;

            // iterates over all the data values
            // to draw the respective lines
            for (var key in dataValues) {
                // retrieves the current values
                var currentValues = dataValues[key]

                // retrieves the color index (modulus)
                var colorIndex = valuesIndex % chartColorsLength;

                // retrieves the current color
                var currentColor = chartColors[colorIndex];

                // sets the current stroke color in the context
                context.strokeStyle = currentColor

                // sets the initial current x position value
                var currentX = marginLeft + verticalLabelWidth;

                // begins the path
                context.beginPath();

                // retrieves the initial value
                var initialValue = currentValues[0];

                // calculates the (vertical) position from the current
                // initial value
                var deltaValue = initialValue - minimumValue;
                var valueSteps = (deltaValue * verticalSteps) / maximumValue;
                var positionValue = valueSteps * yPositionIncrement;

                // moves to the initial line position
                context.moveTo(currentX, marginTop + verticalAxisSize
                                - positionValue);

                // increments the current x position with the x
                // position increment
                currentX += xPositionIncrement;

                // iterates over the horizontal steps to draw the various lines
                for (var index = 1; index < horizontalSteps; index++) {
                    // retrieves the current value
                    var currentValue = currentValues[index];

                    // calculates the (vertical) position from the current value
                    var deltaValue = currentValue - minimumValue;
                    var valueSteps = (deltaValue * verticalSteps)
                            / maximumValue;
                    var positionValue = valueSteps * yPositionIncrement;

                    // draws the line to the current position value
                    context.lineTo(currentX, marginTop + verticalAxisSize
                                    - positionValue);

                    // increments the current x position with the x
                    // position increment
                    currentX += xPositionIncrement;
                }

                // strokes and closes the path
                context.stroke();
                context.closePath();

                // sets the initial current x position value
                var currentX = marginLeft + verticalLabelWidth;

                // iterates over the horizontal steps to draw the various circles
                for (var index = 0; index < horizontalSteps; index++) {
                    // retrieves the current value
                    var currentValue = currentValues[index];

                    // calculates the (vertical) position from the current value
                    var deltaValue = currentValue - minimumValue;
                    var valueSteps = (deltaValue * verticalSteps)
                            / maximumValue;
                    var positionValue = valueSteps * yPositionIncrement;

                    // sets the background circle color as the fill color
                    context.fillStyle = backgroundCircleColor;

                    // draws the bigger background circle
                    context.beginPath();
                    context.arc(currentX, marginTop + verticalAxisSize
                                    - positionValue, 20, 0, Math.PI * 2, true);
                    context.fill();
                    context.closePath();

                    // increments the current x position with the x
                    // position increment
                    currentX += xPositionIncrement;
                }

                // increments the values index
                valuesIndex++;
            }

            // iterates over all the data values
            // to draw the respective value circles
            for (var key in dataValues) {
                // retrieves the current values
                var currentValues = dataValues[key]

                // sets the initial current x position value
                var currentX = marginLeft + verticalLabelWidth;

                // iterates over the horizontal steps to draw the various circles
                for (var index = 0; index < horizontalSteps; index++) {
                    // retrieves the current value
                    var currentValue = currentValues[index];

                    // calculates the (vertical) position from the current value
                    var deltaValue = currentValue - minimumValue;
                    var valueSteps = (deltaValue * verticalSteps)
                            / maximumValue;
                    var positionValue = valueSteps * yPositionIncrement;

                    // sets the value circle color as the fill color
                    context.fillStyle = valueCircleColor;

                    // draws the smaller value circle
                    context.beginPath();
                    context.arc(currentX, marginTop + verticalAxisSize
                                    - positionValue, 10, 0, Math.PI * 2, true);
                    context.fill();
                    context.closePath();

                    // increments the current x position with the x
                    // position increment
                    currentX += xPositionIncrement;
                }

                // increments the values index
                valuesIndex++;
            }

            // restores the state
            context.restore();
        };

        var initializeContext = function(matchedObject, options) {
            // retrieves the options values
            var context = options["context"];
            var labelFontName = options["labelFontName"];
            var labelFontSize = options["labelFontSize"];

            // sets the initial context configuration
            context.fillStyle = "#ffffff";
            context.strokeStyle = "#ffffff";

            context.lineWidth = 4;
            context.font = labelFontSize + "px " + labelFontName;
        };

        var populateoptions = function(matchedObject, options) {
            // retrieves the options values
            var chartWidth = options["width"];
            var chartHeight = options["height"];

            // sets the ui values
            var labelFontName = options["labelFontName"]
                    ? options["labelFontName"]
                    : LABEL_FONT_NAME;
            var labelFontSize = options["labelFontSize"]
                    ? options["labelFontSize"]
                    : LABEL_FONT_SIZE;
            var labelFontRealSize = options["labelFontRealSize"]
                    ? options["labelFontRealSize"]
                    : LABEL_FONT_REAL_SIZE;
            var axisColor = options["axisColor"]
                    ? options["axisColor"]
                    : AXIS_COLOR;
            var auxiliaryAxisColor = options["auxiliaryAxisColor"]
                    ? options["auxiliaryAxisColor"]
                    : AUXILIARY_AXIS_COLOR;
            var valueCircleColor = options["valueCircleColor"]
                    ? options["valueCircleColor"]
                    : VALUE_CIRCLE_COLOR;
            var backgroundCircleColor = options["backgroundCircleColor"]
                    ? options["backgroundCircleColor"]
                    : BACKGROUND_CIRCLE_COLOR;
            var backgroundBoxColor = options["backgroundBoxColor"]
                    ? options["backgroundBoxColor"]
                    : BACKGROUND_BOX_COLOR;
            var chartColors = options["chartColors"]
                    ? options["chartColors"]
                    : CHART_COLORS;

            // sets the number of steps
            var verticalSteps = options["verticalSteps"]
                    ? options["verticalSteps"]
                    : VERTICAL_STEPS;
            var horizontalSteps = options["horizontalSteps"]
                    ? options["horizontalSteps"]
                    : HORIZONTAL_STEPS;

            // sets the maximum and minimum values and calculates
            // the range value
            var maximumValue = options["maximumValue"]
                    ? Math.ceil(options["maximumValue"] / verticalSteps)
                            * verticalSteps
                    : MAXIMUM_VALUE;
            var minimumValue = options["minimumValue"]
                    ? options["minimumValue"]
                    : MINIMUM_VALUE;
            var rangeValue = maximumValue - minimumValue;

            // the increment in each step value to be used
            var stepValue = Math.round(rangeValue / verticalSteps);

            // retrieves the horizontal and vertical label width
            // and height values
            var horizontalLabelHeight = options["horizontalLabelHeight"]
                    ? options["horizontalLabelHeight"]
                    : HORIZONTAL_LABEL_HEIGHT;
            var verticalLabelWidth = options["verticalLabelWidth"]
                    ? options["verticalLabelWidth"]
                    : VERTICAL_LABEL_WIDTH;

            // retrieves the label offset
            var labelOffset = options["labelOffset"]
                    ? options["labelOffset"]
                    : LABEL_OFFSET;

            // calculates the horizontal margins
            var marginLeft = options["marginLeft"]
                    ? options["marginLeft"]
                    : MARGIN_LEFT;
            var marginRight = options["marginRight"]
                    ? options["marginRight"]
                    : MARGIN_RIGHT;
            var horizontalMargin = marginLeft + marginRight
                    + verticalLabelWidth;

            // calculates the vertical margins
            var marginTop = options["marginTop"]
                    ? options["marginTop"]
                    : MARGIN_TOP;
            var marginBottom = options["marginBottom"]
                    ? options["marginBottom"]
                    : MARGIN_BOTTOM;
            var verticalMargin = marginTop + marginBottom
                    + horizontalLabelHeight;

            // calculates the box margins and offsets
            var boxMarginHorizontal = options["boxMarginHorizontal"]
                    ? options["boxMarginHorizontal"]
                    : BOX_MARGIN_HORIZONTAL;
            var boxMarginVertical = options["boxMarginVertical"]
                    ? options["boxMarginVertical"]
                    : BOX_MARGIN_VERTICAL;
            var boxHorizontalOffset = options["boxHorizontalOffset"]
                    ? options["boxHorizontalOffset"]
                    : BOX_HORIZONTAL_OFFSET;
            var boxVerticalOffset = options["boxVerticalOffset"]
                    ? options["boxVerticalOffset"]
                    : BOX_VERTICAL_OFFSET;

            // calculates the size of the axis based on the
            var horizontalAxisSize = chartWidth - horizontalMargin;
            var verticalAxisSize = chartHeight - verticalMargin;

            // sets the options values
            options["labelFontName"] = labelFontName;
            options["labelFontSize"] = labelFontSize;
            options["labelFontRealSize"] = labelFontRealSize;
            options["axisColor"] = axisColor;
            options["auxiliaryAxisColor"] = auxiliaryAxisColor;
            options["valueCircleColor"] = valueCircleColor;
            options["backgroundCircleColor"] = backgroundCircleColor;
            options["backgroundBoxColor"] = backgroundBoxColor;
            options["chartColors"] = chartColors;
            options["verticalSteps"] = verticalSteps;
            options["horizontalSteps"] = horizontalSteps;
            options["maximumValue"] = maximumValue;
            options["minimumValue"] = minimumValue;
            options["rangeValue"] = rangeValue;
            options["stepValue"] = stepValue;
            options["horizontalLabelHeight"] = horizontalLabelHeight;
            options["verticalLabelWidth"] = verticalLabelWidth;
            options["labelOffset"] = labelOffset;
            options["marginLeft"] = marginLeft;
            options["marginRight"] = marginRight;
            options["horizontalMargin"] = horizontalMargin;
            options["marginTop"] = marginTop;
            options["marginBottom"] = marginBottom;
            options["verticalMargin"] = verticalMargin;
            options["boxMarginHorizontal"] = boxMarginHorizontal;
            options["boxMarginVertical"] = boxMarginVertical;
            options["boxHorizontalOffset"] = boxHorizontalOffset;
            options["boxVerticalOffset"] = boxVerticalOffset;
            options["horizontalAxisSize"] = horizontalAxisSize;
            options["verticalAxisSize"] = verticalAxisSize;
        };

        var drawLabelBox = function(matchedObject, options) {
            // retrieves the options values
            var context = options["context"];
            var data = options["data"];
            var labelFontRealSize = options["labelFontRealSize"];
            var backgroundBoxColor = options["backgroundBoxColor"];
            var chartColors = options["chartColors"];
            var auxiliaryAxisColor = options["auxiliaryAxisColor"];
            var verticalLabelWidth = options["verticalLabelWidth"];
            var marginLeft = options["marginLeft"];
            var marginTop = options["marginTop"];
            var boxMarginHorizontal = options["boxMarginHorizontal"];
            var boxMarginVertical = options["boxMarginVertical"];
            var boxHorizontalOffset = options["boxHorizontalOffset"];
            var boxVerticalOffset = options["boxVerticalOffset"];
            var horizontalAxisSize = options["horizontalAxisSize"];
            var verticalAxisSize = options["verticalAxisSize"];

            // retrieves the data values
            var dataValues = data["values"];

            // retrieves the chart colors length
            var chartColorsLength = chartColors.length;

            // sets the initial value count
            var valueCount = 0;

            // sets the initial largest width value
            var largestWidth = 0;

            // iterates over all the data values
            for (var key in dataValues) {
                // measures the text size to retrieve
                // the text width
                var textMetrics = context.measureText(key);
                var textWidth = textMetrics.width;

                // updates the largest width
                largestWidth = textWidth > largestWidth
                        ? textWidth
                        : largestWidth;

                // increments the value count
                valueCount++;
            }

            // calculates the line height from the label font real size
            // and the vertical margin
            var lineHeight = labelFontRealSize + boxMarginVertical;

            // calculates the box dimension with the border values in mind
            // and also counting with the number of items
            var boxWidth = largestWidth + (2 * boxMarginHorizontal) + 46;
            var boxHeight = valueCount * lineHeight + boxMarginVertical;

            // calculates the box position with the offset and anchored
            // to the current defined position
            var boxX = marginLeft + verticalLabelWidth + horizontalAxisSize
                    - boxWidth - boxHorizontalOffset;
            var boxY = marginTop + boxVerticalOffset;

            // sets the background box fill color as the background box color
            context.fillStyle = backgroundBoxColor;

            // draws the box rectangle
            context.beginPath()
            context.roundRectangle(boxX, boxY, boxWidth, boxHeight, 6);
            context.stroke();
            context.fill();
            context.closePath();

            // sets the initial curret x value
            var currentX = boxX + boxMarginHorizontal + 40;

            // sets the initial curret y value
            var currentY = boxY + lineHeight;

            // starts the values index value
            var valuesIndex = 0;

            // iterates over all the data values
            for (var key in dataValues) {
                // retrieves the color index (modulus)
                var colorIndex = valuesIndex % chartColorsLength;

                // retrieves the current color
                var currentColor = chartColors[colorIndex];

                // sets the current stroke color in the context
                context.strokeStyle = currentColor

                // sets the background circle color as the fill color
                context.fillStyle = "#ffffff";

                // draws the current value as string
                context.fillText(key, currentX, currentY);

                // sets the background circle color as the fill color
                context.fillStyle = currentColor;

                // draws the color indicator circle
                context.beginPath();
                context.arc(currentX - 24, currentY - 10, 10, 0, Math.PI * 2,
                        true);
                context.fill();
                context.closePath();

                // increments the current y position
                // with the line height
                currentY += lineHeight;

                // increments the values index
                valuesIndex++;
            }
        };

        var processData = function(matchedObject, options) {
            // retrieves the options values
            var data = options["data"] ? options["data"] : DATA;

            // retrieves the data values
            var dataValues = data["values"];

            // initializes the maximum and minimum value
            var maximumValue = 0;

            // iterates over all the data values
            for (var key in dataValues) {
                // retrieves the current values
                var currentValues = dataValues[key]

                // retrieves the current values length
                var currentValuesLength = currentValues.length;

                // iterates over all the current values
                for (var index = 0; index < currentValuesLength; index++) {
                    // retrieves the current value
                    var currentValue = currentValues[index];

                    // in case the current value is greater
                    // than the maximum value
                    if (currentValue > maximumValue) {
                        // replaces the current maximum value
                        // with the current value
                        maximumValue = currentValue;
                    }
                }
            }

            // sets the options values
            options["data"] = data;
            options["maximumValue"] = maximumValue;
        };

        var draw = function() {
            // retrieves the chart as the matched object
            var chart = matchedObject;

            // retrieves the chart element reference
            var chartElement = chart.get(0);

            // retrieves the chart element context
            var context = chartElement.getContext("2d");

            // retrieves the chart size
            var chartWidth = chartElement.width;
            var chartHeight = chartElement.height;

            // clears the context
            context.clearRect(0, 0, chartWidth, chartHeight);

            // sets the base information in the options
            options["chart"] = chart;
            options["context"] = context;

            // sets the size in the options
            options["width"] = chartWidth;
            options["height"] = chartHeight;

            // processes the data in the options
            processData(matchedObject, options);

            // populates the options with the measured values
            populateoptions(matchedObject, options);

            // initializes the context
            initializeContext(matchedObject, options);

            // draws the auxiliary axis
            drawAuxiliaryAxis(matchedObject, options);

            // draws the axis
            drawAxis(matchedObject, options);

            // draws the axis labels
            drawAxisLabels(matchedObject, options);

            // draws the lines
            drawLines(matchedObject, options);

            // draws the label box
            drawLabelBox(matchedObject, options);
        };

        // switches over the method
        switch (method) {
            case "draw" :
                // initializes the plugin
                draw();

                // breaks the switch
                break;

            case "default" :
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
