angular
    .module('FakePartnerApp')
    .controller('AddOrderItemController', [
        '$scope', '$modalInstance', 'OrderHelper', 'order', 'locationId', 'Meerkat', AddOrderItemController
    ]);

function AddOrderItemController($scope, $modalInstance, OrderHelper, order, locationId, Meerkat) {
    console.log(order);
    $scope.itemForm = {
        posId: 0,
        quantity: 1,
        unitPrice: 1000,
        name: "Pepperoni Pizza",
        type: "single",

        includedItems: [],
        options: [],
        status: "pending"
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

        Meerkat.addOrderItems(locationId, order, [$scope.itemForm]).then(
            response => {

                $modalInstance.close();
            });
    };

    function calculateItemCost() {
        var beforeSurcount = $scope.itemForm.quantity * $scope.itemForm.unitPrice;
        for (var i = 0; i < $scope.itemForm.includedItems.length; ++i) {
            var include = $scope.itemForm.includedItems[i];

            beforeSurcount += include.quantity * include.unitPrice;
            for (var j = 0; j < include.options.length; ++j) {
                var option = include.options[j];
                if (option.variants === null)
                    continue;

                for (var k = 0; k < option.variants.length; ++k) {
                    var variant = option.variants[k];
                    beforeSurcount += variant.price;
                }
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
        $scope.itemForm.includedItems.push({
            name: "",
            options: [],
            quantity: 1,
            unitPrice: 0,
            posId: 0
        });
    }

    $scope.deleteInclude = function(include) {
        var index = $scope.itemForm.includedItems.indexOf(include);
        if (index >= 0)
            $scope.itemForm.includedItems.splice(index, 1);
    };
}