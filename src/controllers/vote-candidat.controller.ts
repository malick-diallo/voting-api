import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Vote,
  Candidat,
} from '../models';
import {VoteRepository} from '../repositories';

export class VoteCandidatController {
  constructor(
    @repository(VoteRepository)
    public voteRepository: VoteRepository,
  ) { }

  @get('/votes/{id}/candidat', {
    responses: {
      '200': {
        description: 'Candidat belonging to Vote',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Candidat),
          },
        },
      },
    },
  })
  async getCandidat(
    @param.path.string('id') id: typeof Vote.prototype.id,
  ): Promise<Candidat> {
    return this.voteRepository.candidat(id);
  }
}
