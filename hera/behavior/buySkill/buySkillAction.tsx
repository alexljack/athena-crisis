import { BuySkillActionResponse } from '@deities/apollo/ActionResponse.tsx';
import applyActionResponse from '@deities/apollo/actions/applyActionResponse.tsx';
import { fbt } from 'fbtee';
import AnimationKey from '../../lib/AnimationKey.tsx';
import getSkillConfigForDisplay from '../../lib/getSkillConfigForDisplay.tsx';
import getTranslatedFactionName from '../../lib/getTranslatedFactionName.tsx';
import getUserDisplayName from '../../lib/getUserDisplayName.tsx';
import isInvader from '../../lib/isInvader.tsx';
import { SkillRewardActionResponse } from '../../lib/isSkillRewardActionResponse.tsx';
import { Actions, State } from '../../Types.tsx';
import { resetBehavior } from '../Behavior.tsx';
import NullBehavior from '../NullBehavior.tsx';

export default async function buySkillAction(
  { requestFrame, update }: Actions,
  actionResponse: BuySkillActionResponse | SkillRewardActionResponse,
): Promise<State> {
  const { player } = actionResponse;
  const isBuy = actionResponse.type === 'BuySkill';
  const skill = isBuy ? actionResponse.skill : actionResponse.reward.skill;
  const isPermanent = !isBuy && actionResponse.permanent;

  const { colors, name } = getSkillConfigForDisplay(skill);
  return new Promise((resolve) =>
    update((state) => ({
      animations: state.animations.set(new AnimationKey(), {
        color: colors,
        direction: 'up',
        length: isPermanent && isInvader(state.map, player) ? 'medium' : 'long',
        onComplete: (state) => {
          requestFrame(() =>
            resolve({
              ...state,
              ...resetBehavior(),
            }),
          );
          return null;
        },
        player,
        sound: 'UI/Start',
        style: 'flashy',
        text: String(
          isBuy
            ? fbt(
                fbt.param(
                  'player',
                  getTranslatedFactionName(state.playerDetails, player),
                ) +
                  ' bought the skill ' +
                  fbt.param('skill', name) +
                  '!',
                'Receive reward message',
              )
            : isPermanent
              ? fbt(
                  fbt.param(
                    'user',
                    getUserDisplayName(state.playerDetails, player),
                  ) +
                    ' received the skill ' +
                    fbt.param('skill', name) +
                    '!',
                  'Receive reward message',
                )
              : fbt(
                  fbt.param(
                    'player',
                    getTranslatedFactionName(state.playerDetails, player),
                  ) +
                    ' temporarily received the skill ' +
                    fbt.param('skill', name) +
                    ' for this game!',
                  'Receive reward message',
                ),
        ),
        type: 'banner',
      }),
      map: applyActionResponse(state.map, state.vision, actionResponse),
      ...resetBehavior(NullBehavior),
    })),
  );
}
