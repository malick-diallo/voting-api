import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Candidat,
  Vote,
} from '../models';
import {CandidatRepository} from '../repositories';

export class CandidatVoteController {
  constructor(
    @repository(CandidatRepository) protected candidatRepository: CandidatRepository,
  ) { }

  @get('/candidats/{id}/votes', {
    responses: {
      '200': {
        description: 'Array of Candidat has many Vote',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Vote)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Vote>,
  ): Promise<Vote[]> {
    return this.candidatRepository.votes(id).find(filter);
  }

  @post('/candidats/{id}/votes', {
    responses: {
      '200': {
        description: 'Candidat model instance',
        content: {'application/json': {schema: getModelSchemaRef(Vote)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Candidat.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vote, {
            title: 'NewVoteInCandidat',
            exclude: ['id'],
            optional: ['candidatId']
          }),
        },
      },
    }) vote: Omit<Vote, 'id'>,
  ): Promise<Vote> {
    return this.candidatRepository.votes(id).create(vote);
  }

  @patch('/candidats/{id}/votes', {
    responses: {
      '200': {
        description: 'Candidat.Vote PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vote, {partial: true}),
        },
      },
    })
    vote: Partial<Vote>,
    @param.query.object('where', getWhereSchemaFor(Vote)) where?: Where<Vote>,
  ): Promise<Count> {
    return this.candidatRepository.votes(id).patch(vote, where);
  }

  @del('/candidats/{id}/votes', {
    responses: {
      '200': {
        description: 'Candidat.Vote DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Vote)) where?: Where<Vote>,
  ): Promise<Count> {
    return this.candidatRepository.votes(id).delete(where);
  }
}
