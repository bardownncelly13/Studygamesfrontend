import React from "react";

const GameCard = ({ game:
     { title, vote_average, poster_path, release_date, original_language },
     onClick
}) => {

    return (
        <div className="game-card transform transition-transform duration-200 hover:scale-105" onClick={onClick} style={{cursor:"pointer"}}>
      <img
        src={poster_path ?
          `${poster_path}` : '/no-movie.png'}
        alt={title}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>

          <span>•</span>
          <p className="year">
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
      
    </div>
    )

}

export default GameCard