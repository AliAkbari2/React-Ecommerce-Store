function StarRating(props) {
  const { rating, numReviews } = props;
  //Returns HTML code 
  return (
    <div className="rating">
      <span>
        <i
          className={
            //use star symbols from fas fonts
            rating >= 1
              ? "fas fa-star"
              : rating >= 0.5
                ? "fas fa-star-half-alt"
                : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            //use star symbols from fas fonts
            rating >= 2
              ? "fas fa-star"
              : rating >= 1.5
                ? "fas fa-star-half-alt"
                : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            //use star symbols from fas fonts
            rating >= 3
              ? "fas fa-star"
              : rating >= 2.5
                ? "fas fa-star-half-alt"
                : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            //use star symbols from fas fonts
            rating >= 4
              ? "fas fa-star"
              : rating >= 3.5
                ? "fas fa-star-half-alt"
                : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            //use star symbols from fas fonts
            rating >= 5
              ? "fas fa-star"
              : rating >= 4.5
                ? "fas fa-star-half-alt"
                : "far fa-star"
          }
        />
      </span>
      <span> {numReviews} reviews</span>
    </div>
  );
}

//StarRating component, exports fas font stars
export default StarRating;
