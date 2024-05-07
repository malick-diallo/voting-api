import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Candidat, CandidatRelations, Vote} from '../models';
import {VoteRepository} from './vote.repository';

export class CandidatRepository extends DefaultCrudRepository<
  Candidat,
  typeof Candidat.prototype.id,
  CandidatRelations
> {

  public readonly votes: HasManyRepositoryFactory<Vote, typeof Candidat.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('VoteRepository') protected voteRepositoryGetter: Getter<VoteRepository>,
  ) {
    super(Candidat, dataSource);
    this.votes = this.createHasManyRepositoryFactoryFor('votes', voteRepositoryGetter,);
    this.registerInclusionResolver('votes', this.votes.inclusionResolver);
  }
}
