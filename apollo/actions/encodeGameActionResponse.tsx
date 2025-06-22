import Building, { PlainBuilding } from '@deities/athena/map/Building.tsx';
import { PlainEntitiesList } from '@deities/athena/map/PlainMap.tsx';
import { PlayerIDSet } from '@deities/athena/map/Player.tsx';
import { encodeEntities } from '@deities/athena/map/Serialization.tsx';
import Unit, { PlainUnit } from '@deities/athena/map/Unit.tsx';
import Vector from '@deities/athena/map/Vector.tsx';
import MapData from '@deities/athena/MapData.tsx';
import { VisionT } from '@deities/athena/Vision.tsx';
import ImmutableMap from '@nkzw/immutable-map';
import { ActionResponse } from '../ActionResponse.tsx';
import { encodeActionResponse } from '../EncodedActions.tsx';
import computeVisibleActions from '../lib/computeVisibleActions.tsx';
import getVisibleEntities from '../lib/getVisibleEntities.tsx';
import {
  EncodedGameActionResponse,
  EncodedGameActionResponseItem,
  GameState,
} from '../Types.tsx';

const removeActionedEntities = <T extends Unit | Building>(
  entities: ImmutableMap<Vector, T> | null,
  actionResponse?: ActionResponse | null,
): ImmutableMap<Vector, T> => {
  if (!entities || !entities.size) {
    return ImmutableMap();
  }

  // Delete entities from this map that were being acted on by the user.
  // Those will be visible and updated through the action itself.
  if (actionResponse && 'from' in actionResponse && actionResponse.from) {
    entities = entities.delete(actionResponse.from);
  }
  if (actionResponse && 'to' in actionResponse && actionResponse.to) {
    entities = entities.delete(actionResponse.to);
  }
  return entities;
};

const addVisibleEntities = (
  previousMap: MapData,
  currentMap: MapData,
  vision: VisionT,
  actionResponse: ActionResponse,
  labels: PlayerIDSet | null,
):
  | [
      PlainEntitiesList<PlainBuilding> | undefined,
      PlainEntitiesList<PlainUnit> | undefined,
    ]
  | null => {
  if (!previousMap.config.fog) {
    return null;
  }

  const [buildings, units] = getVisibleEntities(
    previousMap,
    currentMap,
    vision,
    labels,
  );
  const actualBuildings =
    actionResponse.type === 'Move'
      ? buildings
      : removeActionedEntities(buildings, actionResponse);
  const actualUnits = removeActionedEntities(units, actionResponse);
  return [
    actualBuildings.size ? encodeEntities(actualBuildings) : undefined,
    actualUnits.size ? encodeEntities(actualUnits) : undefined,
  ];
};

const encodeItem = (
  actionResponse: ActionResponse,
  vision: VisionT,
  previousMap: MapData | undefined,
  currentMap: MapData | undefined,
  labels: PlayerIDSet | null,
): EncodedGameActionResponseItem => {
  const encodedActionResponse = encodeActionResponse(actionResponse);
  const visible =
    previousMap && currentMap
      ? addVisibleEntities(
          previousMap,
          currentMap,
          vision,
          actionResponse,
          labels,
        )
      : null;

  return visible
    ? [encodedActionResponse, ...visible]
    : [encodedActionResponse];
};

export default function encodeGameActionResponse(
  clientMap: MapData,
  initialMap: MapData,
  vision: VisionT,
  gameState: GameState | null,
  timeout: Date | null | undefined,
  actionResponse: ActionResponse | null,
  labels: PlayerIDSet | null,
) {
  const response: EncodedGameActionResponse = [
    actionResponse
      ? encodeItem(actionResponse, vision, clientMap, initialMap, labels)
      : null,
  ];

  if (gameState?.length) {
    response[1] = computeVisibleActions(initialMap, vision, gameState).map(
      ([actionResponse, previousMap, currentMap]) =>
        encodeItem(actionResponse, vision, previousMap, currentMap, labels),
    );
  }

  if (timeout !== undefined) {
    response[2] = timeout?.getTime() || null;
  }

  return response;
}
