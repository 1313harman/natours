class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    // console.log('from class', this.query);
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeObj = ['sort', 'limit', 'page', 'fields'];
    excludeObj.forEach((el) => delete queryObj[el]);
    // console.log('from filter method', this.queryString);
    //output is { difficulty: 'easy', duration: { $gte instead of this=>gte: '5' }, page: '5' }
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`,
    );
    // console.log(queryObj);
    //Now the output is {"difficulty":"easy","duration":{"$gte":"5"}}
    this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      //output for ex:-price ratingsAverage from this { sort: '-price,ratingsAverage' }
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  limit() {
    if (this.queryString.fields) {
      const onlyFields = this.queryString.fields.split(',').join(' ');
      // console.log(onlyFields);
      //Output is name duration price instead of this { fields: 'name,duration,price' }
      this.query = this.query.select(onlyFields);
    } else {
      //this will exclude __v filed in json data if condition remains false
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    //ex: the requested page is 2 and requested limit is 2 soo the page which will show is onlt (2-1)*2 that is it will skip page 2 and continue with next one
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIfeatures;
