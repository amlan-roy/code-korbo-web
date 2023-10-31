"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import YouTubeIcon from "@mui/icons-material/YouTube";
import YouTube, { YouTubeProps } from "react-youtube";
import { youtube_parser } from "@/utils/functions/urlHelpers";
import { TQuestionDifficultyName } from "@/utils/types/difficulty";
import { TQuestionCategoryName } from "@/utils/types/category";
import { TFormattedQuestion } from "@/utils/types/question";
import Link from "next/link";
import { getFormattedProblems } from "@/utils/functions/dataFetchers";
import ErrorPage from "../Pages/ErrorPage";

type FiltersType = {
  pageCount: number;
};

type QuestionsTableProps = {
  data?: TFormattedQuestion[];
  loading?: boolean;
  setFetchedProblems: Dispatch<
    SetStateAction<TFormattedQuestion[] | undefined>
  >;
  uid?: string;
};

const paginationPageCount = 10;

const opts: YouTubeProps["opts"] = {
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

const Status = ({ solved }: { solved?: boolean }) => {
  return (
    <Chip
      color={solved ? "success" : "default"}
      label={solved ? "Solved" : "Unsolved"}
      sx={{ color: !solved ? "text.main" : "" }}
    />
  );
};

const Difficulty = ({
  difficulty = "easy",
}: {
  difficulty?: TQuestionDifficultyName;
}) => {
  return (
    <Chip
      color={
        difficulty === "easy"
          ? "success"
          : difficulty === "medium"
          ? "info"
          : "warning"
      }
      label={difficulty}
      variant="outlined"
      sx={{ color: "text.main" }}
    />
  );
};

const QuestionCategory = ({
  category,
}: {
  category?: TQuestionCategoryName;
}) => {
  return category ? (
    <Chip label={category} variant="outlined" sx={{ color: "text.main" }} />
  ) : null;
};

const Solution = ({
  url,
  setPlayerState,
}: {
  url?: string;
  setPlayerState: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      videoId: string;
    }>
  >;
}) => {
  return url ? (
    <IconButton
      size="medium"
      onClick={(event) => {
        event.stopPropagation();
        setPlayerState({ open: true, videoId: youtube_parser(url) });
      }}
    >
      <YouTubeIcon color="error" sx={{ width: "48px", height: "48px" }} />
    </IconButton>
  ) : null;
};

const QuestionsTable: React.FC<QuestionsTableProps> = ({
  data,
  loading = false,
  uid,
  setFetchedProblems,
}) => {
  useEffect(() => {
    if (loading && uid)
      getFormattedProblems(uid)
        .then((problems) => {
          setFetchedProblems(problems);
        })
        .catch((problemsFetchError) => {
          setIsTableError(true);
        });
  }, [uid, loading]);

  useEffect(() => {
    setFilteredData(data?.slice(0, paginationPageCount));
  }, [data]);

  const [playerState, setPlayerState] = useState({ open: false, videoId: "" });
  const [isTableError, setIsTableError] = useState(false);

  /**
   * Saves pagination and selected filters state
   */
  const [filtersState, setFiltersState] = useState<FiltersType>({
    pageCount: 1,
  });

  const [filteredData, setFilteredData] = useState(
    data?.slice(0, paginationPageCount)
  );

  const closeModal = () => {
    setPlayerState({ open: false, videoId: "" });
  };

  const filterData = (passedFiltersState?: FiltersType) => {
    const { pageCount } = passedFiltersState || filtersState;
    const localFilteredData = data?.slice(
      (pageCount - 1) * paginationPageCount,
      pageCount * paginationPageCount
    );
    setFilteredData(localFilteredData);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const localFiltersState = { ...filtersState, pageCount: value };
    setFiltersState(localFiltersState);
    filterData(localFiltersState);
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const isTableEmpty = filteredData?.length === 0;

  if (isTableError)
    return (
      <ErrorPage
        title="An error occured while loading the table"
        subtitle="Please try again later or let us know about it!"
        isComponent
      />
    );

  return loading || !!!data ? (
    <LoadingSkeleton />
  ) : (
    <>
      <TableContainer
        component={Card}
        sx={{ marginTop: 4, backgroundColor: "colorTokens.gray_100" }}
        className="shadow-2xl"
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "colorTokens.blue_200" }}>
              <TableCell align="left" width={150}>
                <Typography color="text.main" fontWeight="bold">
                  Status
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography color="text.main" fontWeight="bold">
                  Title
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography color="text.main" fontWeight="bold">
                  Difficulty
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography color="text.main" fontWeight="bold">
                  Category
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography color="text.main" fontWeight="bold">
                  Solution
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {!isTableEmpty && (
            <TableBody>
              {filteredData?.map((row, index) => (
                <TableRow
                  key={`table-row-${
                    (filtersState.pageCount - 1) * paginationPageCount +
                    index +
                    1
                  }`}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: "colorTokens.gray_100",
                  }}
                >
                  <TableCell align="left" scope="row">
                    <Status solved={row.isSolved} />
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      maxWidth: "350px",
                      width: "fit-contnt",
                      minWidth: "150px",
                      ":active": { backgroundColor: "colorTokens.gray_200" },
                      transitionDuration: "0.3s",
                    }}
                    className="cursor-pointer"
                  >
                    <Link
                      href={`/problem/${row.id}`}
                      className="overflow-hidden text-ellipsis line-clamp-2 w-full text-blue-600 no-underline font-semibold text-base"
                    >
                      {row.title}
                    </Link>
                  </TableCell>
                  <TableCell align="left">
                    <Difficulty difficulty={row.difficulty} />
                  </TableCell>
                  <TableCell align="left">
                    <QuestionCategory category={row.category} />
                  </TableCell>
                  <TableCell align="left">
                    <Solution
                      url={row.solutionVideoUrl}
                      setPlayerState={setPlayerState}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {isTableEmpty && (
          <Typography width="fit-content" marginX="auto" marginTop={2}>
            No data found. Please try changing your search queries
          </Typography>
        )}
        <Pagination
          sx={{
            maxWidth: "100%",
            marginX: "auto",
            width: "fit-content",
            marginBottom: 2,
          }}
          count={Math.ceil(data.length / paginationPageCount)}
          page={filtersState.pageCount}
          onChange={handlePageChange}
        />
      </TableContainer>

      {playerState.open && (
        <Modal
          open={playerState.open}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <YouTube videoId={playerState.videoId} opts={opts} />
          </Box>
        </Modal>
      )}
    </>
  );
};

const LoadingSkeleton = () => {
  return (
    <TableContainer
      component={Card}
      sx={{
        marginTop: 4,
        height: 300,
      }}
      className="animate-pulse shadow-2xl"
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "colorTokens.blue_200" }}>
            <TableCell align="left" width={150}>
              <div className="w-full bg-slate-300 h-4 rounded"> </div>
            </TableCell>
            <TableCell align="left">
              <div className="w-full bg-slate-300 h-4 rounded" />
            </TableCell>
            <TableCell align="left">
              <div className="w-full bg-slate-300 h-4 rounded" />
            </TableCell>
            <TableCell align="left">
              <div className="w-full bg-slate-300 h-4 rounded" />
            </TableCell>
            <TableCell align="left">
              <div className="w-full bg-slate-300 h-4 rounded" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="w-full h-full">
          <tr>
            <td>
              <Typography width="fit-content" marginX="auto" marginTop={2}>
                Table Loading...
              </Typography>
            </td>
          </tr>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default QuestionsTable;
