--TeamViewer (one) 1.3c
--Plugin for HeroSelector by Tasyen
--It shows the selection of Players in cols, when a col is full right of it a new is started

TeamViewer = {}

TeamViewer.Scale                = 1.0
TeamViewer.TeamPosX             = 0.02
TeamViewer.TeamPosY             = 0.5
TeamViewer.TeamPosGapY          = 0.015
TeamViewer.TeamPosGapX          = 0.015
TeamViewer.TeamRowCount         = 5
--how big are the Faces
TeamViewer.ButtonSize           = 0.03
TeamViewer.ButtonAlphaSelected  = 150
TeamViewer.ButtonDefaultIcon    = "UI\\Widgets\\EscMenu\\Human\\quest-unknown.blp"
TeamViewer.CategoryButtonSize   = 0.015 --size of the CategoryButtons below an players name
TeamViewer.CategoryButtonGap    = 0.002 -- space between 2 CategoryButtons


TeamViewer.HasPicked = {}
TeamViewer.BackupSelected = HeroSelector.buttonSelected
TeamViewer.BackupCreated = HeroSelector.unitCreated
TeamViewer.BackupRepick = HeroSelector.repick
TeamViewer.BackupDestroy = HeroSelector.destroy

function TeamViewer.AllowPlayer(player)
    return GetPlayerSlotState(player) ==  PLAYER_SLOT_STATE_PLAYING
end

function oppositeFramePoint(framepoint)
    if framepoint == FRAMEPOINT_BOTTOM then return FRAMEPOINT_TOP
    elseif framepoint == FRAMEPOINT_TOP then return FRAMEPOINT_BOTTOM
    elseif framepoint == FRAMEPOINT_TOPLEFT then return FRAMEPOINT_BOTTOMRIGHT
    elseif framepoint == FRAMEPOINT_TOPRIGHT then return FRAMEPOINT_BOTTOMLEFT
    elseif framepoint == FRAMEPOINT_LEFT then return FRAMEPOINT_RIGHT
    elseif framepoint == FRAMEPOINT_RIGHT then return FRAMEPOINT_LEFT
    elseif framepoint == FRAMEPOINT_CENTER then return FRAMEPOINT_CENTER
    elseif framepoint == FRAMEPOINT_BOTTOMLEFT then return FRAMEPOINT_TOPRIGHT
    elseif framepoint == FRAMEPOINT_BOTTOMRIGHT then return FRAMEPOINT_TOPLEFT
    else return framepoint
    end
end

function HeroSelector.destroy()
    for key, value in pairs(TeamViewer.Frames)
    do
        BlzDestroyFrame(value)
    end
    TeamViewer.BackupDestroy() 
    TeamViewer = nil    
end

function TeamViewer.PosFrame(movingFrame, relativFrame)
    BlzFrameSetPoint(movingFrame, FRAMEPOINT_TOPLEFT, relativFrame, FRAMEPOINT_TOPRIGHT, TeamViewer.CategoryButtonGap, 0)
end

function TeamViewer.Init()
    TeamViewer.Frames = {} --this is used to destroy all frames created by TeamViewer.
    while table.remove(TeamViewer) do end
    local function buttonActionFunc(frame)
        HeroSelector.frameLoseFocus(frame)
        TeamViewer.ButtonClicked(GetTriggerPlayer(), TeamViewer[frame])        
    end

    local colRemain = TeamViewer.TeamRowCount
    for index= 0, GetBJMaxPlayers() - 1,1 do
        local player = Player(index)
        if TeamViewer.AllowPlayer(player) then
            table.insert(TeamViewer, player)
            
            local createContext = 1000 + index
            --local playerFrame = BlzCreateFrameByType("FRAME", "TeamViewerPlayerFrame", HeroSelector.Box, "", createContext)
            local playerFrame = BlzCreateFrame("HeroSelectorTextBox", HeroSelector.Box, 0, createContext)
            local colorFrame = BlzCreateFrameByType("BACKDROP", "", playerFrame, "", createContext)
            local button = BlzCreateFrame("HeroSelectorButton", playerFrame, 0, createContext)
            local textFrame = BlzCreateFrame("HeroSelectorText", playerFrame, 0, createContext) -- do not the buttons child, else it is affected by Alpha change
            local icon = BlzGetFrameByName("HeroSelectorButtonIcon", createContext)
            local iconDisabled = BlzGetFrameByName("HeroSelectorButtonIconDisabled", createContext)
            local iconPushed = BlzGetFrameByName("HeroSelectorButtonIconPushed", createContext)
            local tooltipBox = BlzCreateFrame("HeroSelectorTextBox", button, 0, createContext)
            local tooltip = BlzCreateFrame("HeroSelectorText", tooltipBox, 0, createContext)
            TasButtonAction.Set(button , buttonActionFunc)
            BlzFrameSetSize(playerFrame, 0.11 + TeamViewer.ButtonSize, TeamViewer.ButtonSize + TeamViewer.CategoryButtonSize + 0.001)
            BlzFrameSetPoint(colorFrame, FRAMEPOINT_TOPLEFT, playerFrame, FRAMEPOINT_TOPLEFT, 0.005, -0.0035)
            BlzFrameSetPoint(colorFrame, FRAMEPOINT_TOPRIGHT, playerFrame, FRAMEPOINT_TOPRIGHT, -0.005, -0.0035)
            BlzFrameSetSize(colorFrame, 0, 0.003)

            local colorIndex = GetHandleId(GetPlayerColor(player))
            if colorIndex < 10 then
                BlzFrameSetTexture(colorFrame, "ReplaceableTextures\\TeamColor\\TeamColor0"..colorIndex, 0, false)
            else
                 BlzFrameSetTexture(colorFrame, "ReplaceableTextures\\TeamColor\\TeamColor"..colorIndex, 0, false)
            end


            BlzFrameSetSize(button, TeamViewer.ButtonSize, TeamViewer.ButtonSize)
            BlzFrameSetSize(textFrame, 0.105 - TeamViewer.ButtonSize, 0.013)
            
            if #TeamViewer == 1 then
                BlzFrameSetAbsPoint(button,  FRAMEPOINT_BOTTOMLEFT, TeamViewer.TeamPosX, TeamViewer.TeamPosY)
            else
                if colRemain <= 0 then
                    local prevTeamPlayer = TeamViewer[#TeamViewer - TeamViewer.TeamRowCount]
                    colRemain = TeamViewer.TeamRowCount
                    BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, TeamViewer[prevTeamPlayer].Button, FRAMEPOINT_TOPRIGHT, TeamViewer.TeamPosGapX + 0.11, 0)
                else
                    local prevTeamPlayer = TeamViewer[#TeamViewer - 1]
                    BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, TeamViewer[prevTeamPlayer].Button, FRAMEPOINT_BOTTOMLEFT, 0, -TeamViewer.TeamPosGapY)
                end
                    
            end
            colRemain = colRemain - 1
            TeamViewer.PosFrame(textFrame, button)
            BlzFrameSetPoint(tooltip, FRAMEPOINT_BOTTOMLEFT, button, FRAMEPOINT_TOPLEFT, 0, 0.007)
            BlzFrameSetPoint(playerFrame, FRAMEPOINT_TOPLEFT, button, FRAMEPOINT_TOPLEFT, -0.007, 0.007)
            
            BlzFrameSetPoint(tooltipBox, FRAMEPOINT_BOTTOMLEFT, tooltip, FRAMEPOINT_BOTTOMLEFT, -0.007, -0.007)
            BlzFrameSetPoint(tooltipBox, FRAMEPOINT_TOPRIGHT, tooltip, FRAMEPOINT_TOPRIGHT, 0.007, 0.007)
            BlzFrameSetText(textFrame, GetPlayerName(player))
            BlzFrameSetTooltip(button, tooltipBox)
            BlzFrameSetTexture(icon, TeamViewer.ButtonDefaultIcon, 0, true)
            BlzFrameSetTexture(iconPushed, TeamViewer.ButtonDefaultIcon, 0, true)

            table.insert(TeamViewer.Frames, button)
            table.insert(TeamViewer.Frames, textFrame)
            table.insert(TeamViewer.Frames, icon)
            table.insert(TeamViewer.Frames, iconDisabled)
            table.insert(TeamViewer.Frames, iconPushed)            
            table.insert(TeamViewer.Frames, tooltip)
            table.insert(TeamViewer.Frames, playerFrame)

            TeamViewer[player] = {}
            TeamViewer[player].PlayerFrame = playerFrame
            TeamViewer[player].Text = textFrame
            TeamViewer[player].Button = button
            TeamViewer[button] = player
            TeamViewer[player].Icon = icon
            TeamViewer[player].IconDisabled = iconDisabled
            TeamViewer[player].IconPushed = iconPushed            
            TeamViewer[player].Tooltip = tooltip
            TeamViewer[player].Category = {}
            local prevCategoryButton = nil
            --print("Pre HeroSelector.Category")
            for key, value in ipairs(HeroSelector.Category)
            do
                --print("Index",key)
                local categoryButton = {}
                categoryButton.Button = BlzCreateFrameByType("BUTTON", "", playerFrame, "", 0)
                categoryButton.Icon = BlzCreateFrameByType("BACKDROP", "", categoryButton.Button, "", 0)
                categoryButton.TooltipBox = BlzCreateFrame("HeroSelectorTextBox", categoryButton.Button, 0, createContext)
                categoryButton.Tooltip = BlzCreateFrame("HeroSelectorText", categoryButton.TooltipBox, 0, key)
                
                BlzFrameSetPoint(categoryButton.TooltipBox, FRAMEPOINT_BOTTOMLEFT, categoryButton.Tooltip, FRAMEPOINT_BOTTOMLEFT, -0.007, -0.007)
                BlzFrameSetPoint(categoryButton.TooltipBox, FRAMEPOINT_TOPRIGHT, categoryButton.Tooltip, FRAMEPOINT_TOPRIGHT, 0.007, 0.007)
                BlzFrameSetText(categoryButton.Tooltip, BlzFrameGetText(value.Text))
                BlzFrameSetTooltip(categoryButton.Button, categoryButton.TooltipBox)
                BlzFrameSetAllPoints(categoryButton.Icon, categoryButton.Button)
                BlzFrameSetPoint(categoryButton.Tooltip, FRAMEPOINT_BOTTOM, categoryButton.Button, FRAMEPOINT_TOP, 0, 0.007)
                BlzFrameSetSize(categoryButton.Button, 0.015, 0.015)
                BlzFrameSetTexture(categoryButton.Icon, value.Texture, 0, true)
                BlzFrameSetVisible(categoryButton.Button, false)

                table.insert(TeamViewer[player].Category, categoryButton)
                table.insert(TeamViewer.Frames, categoryButton.Button)
                table.insert(TeamViewer.Frames, categoryButton.Icon)
                table.insert(TeamViewer.Frames, categoryButton.Tooltip)
                
            end
            BlzFrameSetScale(playerFrame, TeamViewer.Scale)
        end
    end
end

function TeamViewer.ButtonClicked(clickingPlayer, targetPlayer)
    print(GetPlayerName(clickingPlayer),"Clicked",GetPlayerName(targetPlayer))
end

function HeroSelector.buttonSelected(player, unitCode)

    TeamViewer.BackupSelected(player, unitCode)
    
    if not TeamViewer.HasPicked[player] then
        BlzFrameSetText(TeamViewer[player].Tooltip, GetObjectName(unitCode))
        BlzFrameSetTexture(TeamViewer[player].Icon, BlzGetAbilityIcon(unitCode), 0, true)
        BlzFrameSetTexture(TeamViewer[player].IconPushed, BlzGetAbilityIcon(unitCode), 0, true)
        BlzFrameSetAlpha(TeamViewer[player].Button, TeamViewer.ButtonAlphaSelected)
        local category = 1
        local prevCategoryButton = nil
        for key, value in ipairs(HeroSelector.Category)
        do
            local categoryButton = TeamViewer[player].Category[key]
            BlzFrameClearAllPoints(categoryButton.Button)
            if BlzBitAnd(category, HeroSelector.UnitData[unitCode].Category) > 0 then
                BlzFrameSetVisible(categoryButton.Button, true)
                if not prevCategoryButton then
                    BlzFrameSetPoint(categoryButton.Button, FRAMEPOINT_TOPLEFT, TeamViewer[player].Text, FRAMEPOINT_BOTTOMLEFT, 0, 0)
                else
                    TeamViewer.PosFrame(categoryButton.Button, prevCategoryButton)
                end
                prevCategoryButton = categoryButton.Button
            else
                BlzFrameSetVisible(categoryButton.Button, false)
            end
            category = category + category                
        end
    end
end

function HeroSelector.unitCreated(player, unitCode, isRandom)
    TeamViewer.BackupCreated(player, unitCode, isRandom)
    BlzFrameSetText(TeamViewer[player].Tooltip, GetObjectName(unitCode))
    BlzFrameSetTexture(TeamViewer[player].Icon, BlzGetAbilityIcon(unitCode), 0, true)
    BlzFrameSetTexture(TeamViewer[player].IconPushed, BlzGetAbilityIcon(unitCode), 0, true)
    
    BlzFrameSetAlpha(TeamViewer[player].Button, 255)
    TeamViewer.HasPicked[player] = true
end

function HeroSelector.repick(unit, player)
    TeamViewer.BackupRepick(unit, player)
    if not player then player = GetOwningPlayer(unit) end
    BlzFrameSetText(TeamViewer[player].Tooltip, "")
    BlzFrameSetTexture(TeamViewer[player].Icon, TeamViewer.ButtonDefaultIcon, 0, true)
    BlzFrameSetTexture(TeamViewer[player].IconPushed, TeamViewer.ButtonDefaultIcon, 0, true)
    BlzFrameSetAlpha(TeamViewer[player].Button, 255)
    TeamViewer.HasPicked[player] = false
end
