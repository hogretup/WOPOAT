import { Avatar, CircularProgress, Box, Badge } from "@mui/material";
import { green } from "@mui/material/colors";

const AvatarEXP = ({ avatarSrc, expPercentage, level, size }) => {
  // size = "big": width 100, height 100
  // size = "small": default Avatar size
  return (
    <Badge
      badgeContent={level}
      color="secondary"
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Box display="inline-flex">
        {size === "small" ? (
          <Avatar src={avatarSrc} alt="?" />
        ) : (
          <Avatar src={avatarSrc} alt="?" sx={{ height: 100, width: 100 }} />
        )}

        <CircularProgress
          variant="determinate"
          value={expPercentage}
          size={size === "small" ? 40 : 100}
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
