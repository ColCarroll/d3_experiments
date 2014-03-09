/**
 * Created by colinc on 3/6/14.
 */
'use strict';
var app = angular.module('dataDashboardApp')

app.controller('NgplotCtrl', function ($scope) {

});

app.factory('dataframeService', [function () {
    return { aes: {}
    };
}]);

app.directive('ngplot', function (dataframeService) {
    return {
        replace: true,
        restrict: 'E',
        scope: false,
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
                            dataframeService.df = data;
                        });
                };
            }
        ],
        link: function (scope, element, attrs) {
            scope.getData(attrs.dataurl);
            dataframeService.aes.x = attrs.x || "x";
            dataframeService.aes.y = attrs.y || "y";
            dataframeService.aes.color = attrs.color || "color";
            dataframeService.aes.alpha = attrs.alpha || "alpha";
            dataframeService.aes.size = attrs.size || "size";
        }
    }
});

app.directive('geomPoint', function (dataframeService) {
    return {
        restrict: "E",
        replace: true,
        scope: {},
        controller: [
            '$scope',
            function ($scope) {
                $scope.df = dataframeService;
            }
        ],
        link: function (scope, element, attrs) {
            scope.$watch('df', function () {
                if (scope.df.df) {
                    chartPoints(scope.df.df, angular.extend({}, scope.df.aes, attrs), element[0]);
                }
            }, true)
        }
    }

});


var chartPoints = function (data, opts, element) {
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = (opts.width || 600) - margin.left - margin.right,
        height = (opts.height || 400) - margin.top - margin.bottom;

    var color = d3.scale.category10();

    d3.select('svg').remove();
    var svg = d3.select(element)
        .append('svg:svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.bottom + margin.top)
        .attr('class', 'ngplot')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    svg.selectAll('*').remove();

    var xScale = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d[opts.x]
            })).nice()
            .range([0, width]),
        yScale = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return d[opts.y]
            })).nice()
            .range([height, 0]),
        xTicks = 10,
        yTicks = 10;

    // Begin ggplot axes
    svg.append("rect")
        .attr("class", "grid-background")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append('g')
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(xScale).ticks(2 * xTicks).tickSize(-height))
        .selectAll(".tick")
        .data(xScale.ticks(xTicks), function (d) {
            return d;
        })
        .exit()
        .classed("minor", true);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(xScale).ticks(xTicks).orient('bottom'))
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(opts.x);

    svg.append('g')
        .attr("class", "grid")
        .call(d3.svg.axis().scale(yScale).ticks(2 * yTicks).orient('left').tickSize(-width))
        .selectAll(".tick")
        .data(yScale.ticks(yTicks), function (d) {
            return d;
        })
        .exit()
        .classed("minor", true);

    svg.append("g")
        .attr("class", "axis")
        .call(d3.svg.axis().scale(yScale).ticks(yTicks).orient('left'))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(opts.y);

    // end ggplot axes

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function (d) {
            return d[opts.size] || 3.5;
        })
        .attr("cx", function (d) {
            return xScale(d[opts.x]);
        })
        .attr("cy", function (d) {
            return yScale(d[opts.y]);
        })
        .style("opacity", function (d) {
            return d[opts.alpha] || 1;
        })
        .style("fill", function (d) {
            return color(d[opts.color]) || steelblue;
        });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 15)
        .attr("y", "0.5em")
        .attr("width", "1em")
        .attr("height", "1em")
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 20)
        .attr("y", "1em")
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });

};


