/**
 * Created by colinc on 3/6/14.
 */
'use strict';
var app = angular.module('dataDashboardApp')

app.controller('NgplotCtrl', function ($scope) {

});

app.factory('dataframeService', [function () {
    return {
    };
}]);

app.directive('ngplot', function (dataframeService) {
    return {
        replace: true,
        restrict: 'E',
        scope: {},
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
                            dataframeService.dataframe = data;
                        });
                }
            }
        ],
        link: function (scope, element, attrs) {
            scope.getData(attrs.dataurl);
        }
    }
})

app.directive('geomPoint', function (dataframeService) {
    return {
        restrict: "E",
        replace: true,
        scope: {},
        template: "<div> Hello {{df.dataframe}}</div>",
        controller: [
            '$scope',
            function ($scope) {
                $scope.dataurl = $scope.$parent.dataurl;
                $scope.df = dataframeService;
            }
        ],
        link: function (scope, element, attrs) {
            scope.$watch('df', function () {
                if (scope.df.dataframe) {
                    console.log(scope.df);
                    chartPoints(scope.df.dataframe, attrs, element);
                }
            }, true)
        }
    }

});


var objectMax = function (data, col) {
    return d3.max(data, function (d) {
        return +d[col]
    })
};

var objectMin = function (data, col) {
    return d3.min(data, function (d) {
        return +d[col]
    })
};

var chartPoints = function (data, opts, element) {
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = (opts.width || 600) - margin.left - margin.right,
        height = (opts.height || 400) - margin.top - margin.bottom;

    var color = d3.scale.category10();

    var svg = d3.select(element[0])
        .append('svg:svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.bottom + margin.top)
        .attr('class', 'sparkline')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    svg.selectAll('*').remove();

    var xScale = d3.scale.linear()
            .domain(d3.extent(data, function(d) { return d.x })).nice()
            .range([0, width]),
        yScale = d3.scale.linear()
            .domain(d3.extent(data, function(d) {return d.y})).nice()
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
        .call(d3.svg.axis().scale(yScale).ticks(yTicks).orient('left'));

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {
            return d.size || 3.5;
        })
        .attr("cx", function (d) {
            return xScale(d.x);
        })
        .attr("cy", function (d) {
            return yScale(d.y);
        })
        .style("opacity", function(d){
            return d.alpha || 1;
        })
        .style("fill", function (d) {
            return color(d.c) || steelblue;
        });

};


