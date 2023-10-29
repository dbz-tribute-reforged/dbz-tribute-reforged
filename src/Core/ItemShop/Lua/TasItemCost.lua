-- function TasItemCaclCost(...)
-- calculates the gold and lumbercost of given itemCodes, also accpets strings and a bunch of strings.
-- this will created the items, trigger buy item events + no target order events

-- function TasItemGetCost(itemCode)
-- returns the gold and lumber cost of that item
-- gold, lumber = TasItemGetCost(itemCode)

TasItemData = {
    --Counter = 0,
    Test = {Counter = 0}
}
-- function TasItemCalcDestroy()
do
    local realFunc = InitBlizzard
    function InitBlizzard()
        realFunc()
        local shopOwner = Player(bj_PLAYER_NEUTRAL_EXTRA)
        local shop = CreateUnit(shopOwner, FourCC('nmrk'), 700, -2000, 0)
        local shopRect = Rect(0 , 0, 1000, 1000)
        --print(GetHandleId(shop))
        MoveRectTo(shopRect, GetUnitX(shop), GetUnitY(shop))
        UnitAddAbility(shop, FourCC('AInv'))
        ShowUnit(shop, false)
        IssueNeutralTargetOrder(shopOwner, shop, "smart", shop)

       function TasItemCalcDestroy()
            EnumItemsInRect(shopRect, nil, function()
                RemoveItem(GetEnumItem())
            end)
            ShowUnit(shop, true)
            RemoveUnit(shop)
            RemoveRect(shopRect)
            TasItemData.Test = nil
        end
       local function Start()
          --print("Start", GetObjectName(TasItemData.Test[1]))
            local itemCode = TasItemData.Test[1]
            AddItemToStock(shop, itemCode, 1, 1)
            SetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_GOLD, 99999999)
            SetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_LUMBER, 99999999)
            local gold = GetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_GOLD)
            local lumber = GetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_LUMBER)
            IssueNeutralImmediateOrderById(shopOwner, shop, itemCode)
            local item = CreateItem(itemCode, 0, 0)
            TasItemData[itemCode] = {
                Gold = gold - GetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_GOLD),
                Lumber = lumber - GetPlayerState(shopOwner, PLAYER_STATE_RESOURCE_LUMBER),
                Charge = GetItemCharges(item)
            }
            RemoveItem(item)
            item = nil
            RemoveItemFromStock(shop, itemCode)
            -- testing order does not matter much, simple reindex
            TasItemData.Test[1] = TasItemData.Test[TasItemData.Test.Counter]
            TasItemData.Test.Counter = TasItemData.Test.Counter - 1
            
            if TasItemData.Test.Counter > 0 then
                Start()
            end
            EnumItemsInRect(shopRect, nil, function()
                RemoveItem(GetEnumItem())
            end)
       end
       
        function TasItemCaclCost(...)
            local item
            for index, itemCode in ipairs({...}) do
                if type(itemCode) == "string" then itemCode = FourCC(itemCode) end
                -- if there is already data for that itemcode, skip it
                if not TasItemData[itemCode] then
                    -- is this a valid itemCode? Create it, if that fails skip testing it
                    item = CreateItem(itemCode, 0, 0)
                    if GetHandleId(item) > 0 then
                        RemoveItem(item)
                        TasItemData.Test.Counter = TasItemData.Test.Counter + 1
                        TasItemData.Test[TasItemData.Test.Counter] = itemCode
                    end
                end
            end
            if TasItemData.Test.Counter > 0 then Start() end
            item = nil
        end
        
        function TasItemGetCost(itemCode)
            if type(itemCode) == "string" then itemCode = FourCC(itemCode) end
            if not TasItemData[itemCode] then TasItemCaclCost(itemCode) end
            if TasItemData[itemCode] then 
                return TasItemData[itemCode].Gold, TasItemData[itemCode].Lumber, TasItemData[itemCode].Charge
            else
                return 0, 0, 0
            end
        end
    end
end
