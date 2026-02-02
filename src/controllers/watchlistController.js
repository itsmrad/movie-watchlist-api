import { prisma } from "../config/db.js"

export const addToWatchlist = async (req, res) => {
  const {userId, movieId, status, rating, notes} = req.body

  const movie = await prisma.movie.findUnique({
    where: { id: movieId }
  })

  if (!movie) {
    return res.status(404).json({
      error: "Movie not found"
    })
  }

  // check if already added
  const existingWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId
      }
    }
  })

  if (existingWatchlist){
    return res.status(400).json({
      error: "movie already in the watchlist"
    })
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId,
      movieId,
      status: status || "PLANNED",
      rating,
      notes
    }
  })
  res.status(201).json({
    status: "success",
    data: {
      watchlistItem
    }
  })
}

