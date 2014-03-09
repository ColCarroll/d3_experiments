/**
 * Created by colinc on 3/6/14.
 */
'use strict';
angular.module('dataDashboardApp')
    .controller('NgplotCtrl', function ($scope) {
    })
    .directive('ngplot', function () {
        return {
            replace: true,
            restrict: 'E',
            scope: {
            },
            controller: [
                '$scope',
                '$http',
                function ($scope, $http) {
                    $scope.getData = function (dataurl) {
                        $http({
                            url: dataurl + "?callback=JSON_CALLBACK",
                            method: "JSONP"
                        })
                            .success(function (data) {
                                $scope.plotData = data;
                            });
                    }
                }
            ],
            link: function (scope, element, attrs) {
                scope.getData(attrs.dataurl);
                scope.$watch('plotData', function (newVal) {
                    if (newVal) {
                        scope.dataframe = {};
                        angular.forEach(scope.plotData, function (dataPoint) {
                            angular.forEach(dataPoint, function (value, key) {
                                if (!(key in scope.dataframe)) {
                                    scope.dataframe[key] = [];
                                }
                                scope.dataframe[key].push(value)
                            })
                        });
                    }
                    console.log(scope.dataframe);
                });
            }
        }
    })
    .directive('geomline', function () {
        return {
            restrict: "E",
            replace: true,
            scope: {},
            template: "<div> Hello </div>",
            controller: [
                '$scope',
                function($scope) {
                    $scope.dataurl = $scope.$parent.dataurl;
                }
            ],
            link: function(scope, element, attrs) {
                        console.log(scope.dataurl);
            }
        }

    });


var chartGraph = function (element, data, xLabs, opts) {
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = (opts.width || 600) - margin.left - margin.right,
        height = (opts.height || 400) - margin.top - margin.bottom;

    var svg = d3.select(element[0])
        .append('svg:svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.bottom + margin.top)
        .attr('class', 'sparkline')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    svg.selectAll('*').remove();

    var maxY = d3.max(data),
        x = d3.time.scale()
            .domain([d3.min(xLabs), d3.max(xLabs)])
            .range([0, width]),
        y = d3.scale.linear()
            .domain([d3.min(data), maxY])
            .range([height, 0]),
        xTicks = data.length,
        yTicks = 5;

    svg.append("rect")
        .attr("class", "grid-background")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append('g')
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(x).ticks(2 * xTicks).tickSize(-height))
        .selectAll(".tick")
        .data(x.ticks(xTicks), function (d) {
            return d;
        })
        .exit()
        .classed("minor", true);


    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(x).ticks(d3.time.days, 1).orient('bottom'))
        .selectAll("text")
        .attr("y", 0)
        .attr("dy", "1.5em")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

    svg.append('g')
        .attr("class", "grid")
        .call(d3.svg.axis().scale(y).ticks(2 * yTicks).orient('left').tickSize(-width))
        .selectAll(".tick")
        .data(y.ticks(yTicks), function (d) {
            return d;
        })
        .exit()
        .classed("minor", true);

    svg.append("g")
        .attr("class", "axis")
        .call(d3.svg.axis().scale(y).ticks(yTicks).orient('left'));

    var line = d3.svg.line()
        .interpolate('basis')
        .x(function (d, i) {
            return x(xLabs[i]);
        })
        .y(function (d, i) {
            return y(d);
        });

    svg.append('svg:path')
        .data([data])
        .attr('d', line)
        .attr('class', 'plotLine')
};


