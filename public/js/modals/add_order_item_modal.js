angular
    .module('FakePartnerApp')
    .controller('AddOrderItemController', [
        '$scope', '$modalInstance', 'OrderHelper', 'order', 'locationId', 'Meerkat', AddOrderItemController
    ]);

function AddOrderItemController($scope, $modalInstance, OrderHelper, order, locationId, Meerkat) {

    $scope.loadDefault = function() {
        $scope.itemForm = JSON.parse(
                '{ "posId": "", "quantity": 1, "unitPrice": 1000, "name": "Pepperoni Pizza", "type": "single", "options": [ { "posId": "", "name": "Toppings", "variants": [ { "posId": "", "name": "Pineapple", "price": "300" }, { "posId": "", "name": "Olives", "price": "200" } ] } ], "surcounts": [], "includedItems": [ { "name": "Fries", "options": [ { "posId": "", "name": "Sauce", "min": "0", "max": "1", "variants": [ { "posId": "", "name": "BBQ", "price": "250" } ] } ], "quantity": 1, "unitPrice": 0, "posId": "" } ], "totalBeforeSurcounts": "10002.50", "totalAfterSurcounts": "10002.500" }'
            );
    };

    $scope.vm = {
        sendMultipleItems: false
    };

    $scope.itemForm = {
        posId: "",
        quantity: 1,
        unitPrice: 1000,
        name: "Pepperoni Pizza",
        type: "single",

        //includedItems: [], // no includes if type == single
        options: [],
        surcounts: []
    };

    $scope.canSubmit = function() {
        return true;
    };

    $scope.submit = function() {
        // calculate totals and add them to the data
        var beforeSurcount = calculateItemCost();

        var surcountCharge = calculateSurcountCharge();

        $scope.itemForm.totalBeforeSurcounts = beforeSurcount;
        $scope.itemForm.totalAfterSurcounts = beforeSurcount + surcountCharge;

        clearEmptyPosId();

        if (typeof($scope.itemForm.includedItems) !== "undefined") {
            $scope.itemForm.type = "bundle";
        }

        var items = [$scope.itemForm];

        if ($scope.vm.sendMultipleItems === true) {
            for (var i = 0; i < 3; ++i) {
                items.push($scope.itemForm);
            }
        }

        Meerkat.addOrderItems(locationId, order, items).then(
            response => {
                $scope.$root.$broadcast("ordersUpdatedEvent", {});
                $modalInstance.close();
            });
    };

    function clearEmptyPosId() {
        if ($scope.itemForm.posId.length === 0)
            delete $scope.itemForm.posId;

        if (typeof($scope.itemForm.includedItems) !== "undefined") {
            for (var i = 0; i < $scope.itemForm.includedItems.length; ++i) {
                var include = $scope.itemForm.includedItems[i];

                clearPosId(include);

                for (var j = 0; j < include.options.length; ++j) {
                    var option = include.options[j];

                    clearPosId(option);

                    for (var k = 0; k < option.variants.length; ++k) {
                        var variant = option.variants[k];

                        clearPosId(variant);
                    }
                }
            }
        }

        for (var i = 0; i < $scope.itemForm.options.length; ++i) {
            var option = $scope.itemForm.options[i];
            clearPosId(option);

            for (var j = 0; j < option.variants.length; ++j) {
                var variant = option.variants[j];
                clearPosId(variant);
            }
        }
    }

    function clearPosId(obj) {
        if (obj.posId.length === 0)
            delete obj.posId;
    }

    function calculateItemCost() {
        var beforeSurcount = $scope.itemForm.quantity * $scope.itemForm.unitPrice;

        if (typeof($scope.itemForm.includedItems) === "undefined")
            return beforeSurcount;

        for (var i = 0; i < $scope.itemForm.includedItems.length; ++i) {
            var include = $scope.itemForm.includedItems[i];

            beforeSurcount += Number(include.quantity) * Number(include.unitPrice);
            for (var j = 0; j < include.options.length; ++j) {
                var option = include.options[j];
                if (option.variants === null)
                    continue;

                for (var k = 0; k < option.variants.length; ++k) {
                    var variant = option.variants[k];
                    beforeSurcount += Number(variant.price);
                }
            }
        }

        for (var i = 0; i < $scope.itemForm.options.length; ++i) {
            var option = $scope.itemForm.options[i];
            
            for (var j = 0; j < option.variants.length; ++j) {
                var variant = option.variants[j];

                beforeSurcount += Number(variant.price);
            }
        }

        return beforeSurcount;
    }

    function calculateSurcountCharge() {
        var surcountCharge = 0;
        if ($scope.itemForm.surcounts === null)
            return surcountCharge;

        // TODO: Surcounts
        for (var i = 0; i < $scope.itemForm.surcounts; ++i) {
            continue;
        }

        return surcountCharge;
    }

    $scope.newInclude = function() {
        if (typeof($scope.itemForm.includedItems) === "undefined")
            $scope.itemForm.includedItems = [];

        $scope.itemForm.includedItems.push({
            name: "",
            options: [],
            quantity: 1,
            unitPrice: 0,
            posId: ""
        });
    }

    $scope.deleteInclude = function(include) {
        $scope.removeItemFromArray($scope.itemForm.includedItems, include);

        if ($scope.itemForm.includedItems.length == 0)
            delete $scope.itemForm.includedItems;
    };

    $scope.newOption = function(include) {
        include.options.push({
            posId: "",
            name: "",
            min: "0",
            max: "1",
            variants: []
        });
    };

    $scope.newOptionNoLimits = function(include) {
        include.options.push({
            posId: "",
            name: "",
            variants: []
        });
    };

    $scope.newOptionVariant = function(option) {
        option.variants.push({
            posId: "",
            name: "",
            price: 0
        });
    };

    $scope.removeItemFromArray = function(array, item) {
        var index = array.indexOf(item);
        if (index >= 0)
            array.splice(index, 1);
    }
}