import { Avatar, CircularProgress, Box, Badge } from "@mui/material";
import { green } from "@mui/material/colors";

const AvatarEXP = ({ avatarSrc, expPercentage, level }) => {
  return (
    <Badge
      badgeContent={level}
      color="secondary"
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Box display="inline-flex">
        <Avatar src={avatarSrc} alt="?" />
        <CircularProgress
          variant="determinate"
          value={expPercentage}
          size={40}
          sx={{
            color: green[500],
            position: "absolute",
            zIndex: 1,
          }}
        />
      </Box>
    </Badge>
  );
};

export default AvatarEXP;
