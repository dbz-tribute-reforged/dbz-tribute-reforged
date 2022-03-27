--TeamViewer 1.3c
--Plugin for HeroSelector by Tasyen
--It shows the selection of Teams in groups
--Default setup could be suited for 2 team games

TeamViewer = {}

TeamViewer.ShowNonAllies        = true --show non allies
TeamViewer.UpdateNonAllies      = true --update the image of non allies when the select or pick
TeamViewer.Scale                = 1.0
--position when TeamViewer.ShowNonAllies = false or when a TeamPos is not set
TeamViewer.TeamPosX             = 0.02
TeamViewer.TeamPosY             = 0.5
TeamViewer.TeamPosGapY          = 0.015
TeamViewer.TeamPosLeft2Right    = true --(true) button is left and text is right, (false) button is right and text ist left
--how big are the Faces
TeamViewer.ButtonSize           = 0.03
TeamViewer.ButtonAlphaSelected  = 150
TeamViewer.ButtonDefaultIcon    = "UI\\Widgets\\EscMenu\\Human\\quest-unknown.blp"
TeamViewer.CategoryButtonSize   = 0.015 --size of the CategoryButtons below an players name
TeamViewer.CategoryButtonGap    = 0.002 -- space between 2 CategoryButtons

--used when ShowNonAllies = true
--warcraft 3 Teams start with 0
TeamViewer.TeamPos = {}
TeamViewer.TeamPos[0] = {}
--abs positions on the screen
TeamViewer.TeamPos[0].X = 0.02
TeamViewer.TeamPos[0].Y = 0.5
TeamViewer.TeamPos[0].GapY = 0.015
TeamViewer.TeamPos[0].Left2Right = true

TeamViewer.TeamPos[1] = {}
TeamViewer.TeamPos[1].X = 0.76
TeamViewer.TeamPos[1].Y = 0.5
TeamViewer.TeamPos[1].Left2Right = false

TeamViewer.Frames = {} --this is used to destroy all frames created by TeamViewer.
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
function TeamViewer.PosFirstFrame(movingFrame, relativFrame, left2Right)
    if left2Right then
        --BlzFrameSetPoint(movingFrame, FRAMEPOINT_TOPLEFT, relativFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
        BlzFrameSetPoint(movingFrame, FRAMEPOINT_TOPLEFT, relativFrame, FRAMEPOINT_BOTTOMLEFT, 0, 0)
    else
        BlzFrameSetPoint(movingFrame, FRAMEPOINT_TOPRIGHT, relativFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
    end
end
function TeamViewer.PosFrame(movingFrame, relativFrame, left2Right)
    if left2Right then
        BlzFrameSetPoint(movingFrame, FRAMEPOINT_TOPLEFT, relativFrame, FRAMEPOINT_TOPRIGHT, TeamViewer.CategoryButtonGap, 0)
    else
        BlzFrameSetPoint(movingFrame, FRAMEPOINT_TOPRIGHT, relativFrame, FRAMEPOINT_TOPLEFT, -TeamViewer.CategoryButtonGap, 0)
    end
end
function TeamViewer.Init()
    TeamViewer.Frames = {} --this is used to destroy all frames created by TeamViewer.
    while table.remove(TeamViewer) do end
    local function buttonActionFunc(frame)
        HeroSelector.frameLoseFocus(frame)
        TeamViewer.ButtonClicked(GetTriggerPlayer(), TeamViewer[frame])        
    end

    for index= 0, GetBJMaxPlayers() - 1,1 do
        local player = Player(index)
        if TeamViewer.AllowPlayer(player) then
            local teamNr = GetPlayerTeam(player)
            if not TeamViewer[teamNr] then TeamViewer[teamNr] = {} end
            table.insert(TeamViewer[teamNr], player)
            
            local createContext = 1000 + index
            --local playerFrame = BlzCreateFrameByType("FRAME", "TeamViewerPlayerFrame", HeroSelector.Box, "", createContext)
            local playerFrame = BlzCreateFrame("HeroSelectorTextBox", HeroSelector.Box, 0, createContext)
            local colorFrame = BlzCreateFrameByType("BACKDROP", "", playerFrame, "", createContext)
            local button = BlzCreateFrame("HeroSelectorButton", playerFrame, 0, createContext)
            local textFrame = BlzCreateFrame("HeroSelectorText", playerFrame, 0, createContext) -- do not the buttons child, else it is affected by Alpha change
            local icon = BlzGetFrameByName("HeroSelectorButtonIcon", createContext)
            local iconPushed = BlzGetFrameByName("HeroSelectorButtonIconPushed", createContext)
            local iconDisabled = BlzGetFrameByName("HeroSelectorButtonIconDisabled", createContext)
            local tooltipBox = BlzCreateFrame("HeroSelectorTextBox", button, 0, createContext)
            local tooltip = BlzCreateFrame("HeroSelectorText", tooltipBox, 0, createContext)
            local left2Right = nil
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

            if TeamViewer.ShowNonAllies and TeamViewer.TeamPos[teamNr] then
                left2Right = TeamViewer.TeamPos[teamNr].Left2Right
            else
                left2Right = TeamViewer.TeamPosLeft2Right
            end
            BlzFrameSetSize(button, TeamViewer.ButtonSize, TeamViewer.ButtonSize)
            BlzFrameSetSize(textFrame, 0.105 - TeamViewer.ButtonSize, 0.013)
            if #TeamViewer[teamNr] == 1 then
                if TeamViewer.ShowNonAllies and TeamViewer.TeamPos[teamNr] then
                    BlzFrameSetAbsPoint(button, FRAMEPOINT_BOTTOMLEFT, TeamViewer.TeamPos[teamNr].X, TeamViewer.TeamPos[teamNr].Y)
                else
                    BlzFrameSetAbsPoint(button,  FRAMEPOINT_BOTTOMLEFT, TeamViewer.TeamPosX, TeamViewer.TeamPosY)
                end
            else
                local prevTeamPlayer = TeamViewer[teamNr][#TeamViewer[teamNr] - 1]

                if TeamViewer.TeamPos[teamNr].GapY then
                    BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, TeamViewer[prevTeamPlayer].Button, FRAMEPOINT_BOTTOMLEFT, 0, -TeamViewer.TeamPos[teamNr].GapY)
                else
                    BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, TeamViewer[prevTeamPlayer].Button, FRAMEPOINT_BOTTOMLEFT, 0, -TeamViewer.TeamPosGapY)
                end
            end
            TeamViewer.PosFrame(textFrame, button, left2Right)
            if left2Right then
                BlzFrameSetPoint(tooltip, FRAMEPOINT_BOTTOMLEFT, button, FRAMEPOINT_TOPLEFT, 0, 0.007)
                BlzFrameSetPoint(playerFrame, FRAMEPOINT_TOPLEFT, button, FRAMEPOINT_TOPLEFT, -0.007, 0.007)
            else
                BlzFrameSetPoint(tooltip, FRAMEPOINT_BOTTOMRIGHT, button, FRAMEPOINT_TOPRIGHT, 0, 0.007)
                BlzFrameSetPoint(playerFrame, FRAMEPOINT_TOPRIGHT, button, FRAMEPOINT_TOPRIGHT, 0.007, 0.007)
                BlzFrameSetTextAlignment(textFrame, TEXT_JUSTIFY_TOP, TEXT_JUSTIFY_RIGHT)
            end
            BlzFrameSetPoint(tooltipBox, FRAMEPOINT_BOTTOMLEFT, tooltip, FRAMEPOINT_BOTTOMLEFT, -0.007, -0.007)
            BlzFrameSetPoint(tooltipBox, FRAMEPOINT_TOPRIGHT, tooltip, FRAMEPOINT_TOPRIGHT, 0.007, 0.007)
            BlzFrameSetText(textFrame, GetPlayerName(player))
            BlzFrameSetTooltip(button, tooltipBox)
            BlzFrameSetTexture(icon, TeamViewer.ButtonDefaultIcon, 0, true)
            BlzFrameSetTexture(iconPusheds, TeamViewer.ButtonDefaultIcon, 0, true)
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
            TeamViewer[player].IconPushed = iconPusheds
            TeamViewer[player].IconDisabled = iconDisabled
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
            --When showning only allies, hide non allies
            if not TeamViewer.ShowNonAllies and not IsPlayerAlly(player, GetLocalPlayer()) then
                BlzFrameSetVisible(playerFrame, false)
            end
        end
    end
end

function TeamViewer.ButtonClicked(clickingPlayer, targetPlayer)
    print(GetPlayerName(clickingPlayer),"Clicked",GetPlayerName(targetPlayer))
end

function HeroSelector.buttonSelected(player, unitCode)

    TeamViewer.BackupSelected(player, unitCode)
    
    if not TeamViewer.HasPicked[player] then
        local teamNr = GetPlayerTeam(player)
        if TeamViewer.UpdateNonAllies or IsPlayerAlly(GetLocalPlayer(), player) then
            local hName = getHeroName(unitCode)
            BlzFrameSetText(TeamViewer[player].Tooltip, hName)
            BlzFrameSetTexture(TeamViewer[player].Icon, BlzGetAbilityIcon(unitCode), 0, true)
            BlzFrameSetTexture(TeamViewer[player].IconPushed, BlzGetAbilityIcon(unitCode), 0, true)
            BlzFrameSetAlpha(TeamViewer[player].Button, TeamViewer.ButtonAlphaSelected)
            local category = 1
            local prevCategoryButton = nil
            local left2Right = nil
            if TeamViewer.ShowNonAllies and TeamViewer.TeamPos[teamNr] then
                left2Right = TeamViewer.TeamPos[teamNr].Left2Right
            else
                left2Right = TeamViewer.TeamPosLeft2Right
            end
            for key, value in ipairs(HeroSelector.Category)
            do
                local categoryButton = TeamViewer[player].Category[key]
                BlzFrameClearAllPoints(categoryButton.Button)
                if BlzBitAnd(category, HeroSelector.UnitData[unitCode].Category) > 0 then
                    
                    BlzFrameSetVisible(categoryButton.Button, true)
                    
                    if TeamViewer.ShowNonAllies and TeamViewer.TeamPos[teamNr] then
                        if not prevCategoryButton then
                            --TeamViewer.PosFirstFrame(categoryButton.Button, TeamViewer[player].Button, left2Right)
                            TeamViewer.PosFirstFrame(categoryButton.Button, TeamViewer[player].Text, left2Right)
                            --TeamViewer[player].Text
                        else
                            TeamViewer.PosFrame(categoryButton.Button, prevCategoryButton, left2Right)
                        end
                    else
                        if not prevCategoryButton then
                            TeamViewer.PosFirstFrame(categoryButton.Button, TeamViewer[player].Button, left2Right)
                        else
                            TeamViewer.PosFrame(categoryButton.Button, prevCategoryButton, left2Right)
                        end
                    end
                    
                    prevCategoryButton = categoryButton.Button
                else
                    BlzFrameSetVisible(categoryButton.Button, false)
                end
                category = category + category                
            end
        end
    end
end

function HeroSelector.unitCreated(player, unitCode, isRandom)
    TeamViewer.BackupCreated(player, unitCode, isRandom)
    if TeamViewer.UpdateNonAllies or IsPlayerAlly(GetLocalPlayer(), player) then
        BlzFrameSetText(TeamViewer[player].Tooltip, GetObjectName(unitCode))
        BlzFrameSetTexture(TeamViewer[player].Icon, BlzGetAbilityIcon(unitCode), 0, true)
        BlzFrameSetTexture(TeamViewer[player].IconPushed, BlzGetAbilityIcon(unitCode), 0, true)
        BlzFrameSetAlpha(TeamViewer[player].Button, 255)
    end
    TeamViewer.HasPicked[player] = true
end

function HeroSelector.repick(unit, player)
    TeamViewer.BackupRepick(unit, player)
    if not player then player = GetOwningPlayer(unit) end
    if TeamViewer.UpdateNonAllies or IsPlayerAlly(GetLocalPlayer(), player) then
        BlzFrameSetText(TeamViewer[player].Tooltip, "")
        BlzFrameSetTexture(TeamViewer[player].Icon, TeamViewer.ButtonDefaultIcon, 0, true)
        BlzFrameSetTexture(TeamViewer[player].IconPushed, TeamViewer.ButtonDefaultIcon, 0, true)
        BlzFrameSetAlpha(TeamViewer[player].Button, 255)
    end
    TeamViewer.HasPicked[player] = false
end
