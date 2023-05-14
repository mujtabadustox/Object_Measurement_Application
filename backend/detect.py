import cv2  # importing opencv
import sys  # importing sys
import numpy as np  # importing numpy
import matplotlib.pyplot as plt  # importing matplotlib though we dont need it

# Processing Function


def process_image(imagePath):
    img = cv2.imread(imagePath, cv2.IMREAD_UNCHANGED)  # loading that image
    # converting from RGBA to RGB (this is for fixing the image to give correct image output)
    rgb = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
    gray = cv2.cvtColor(rgb, cv2.COLOR_BGR2GRAY)  # converting to grayscale
    # Guassian Filter at start to reduce noise and smoothen the image
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    # canny edge detector with window size 20-80 , to detect the edges
    edges = cv2.Canny(blur, 20, 80)
    # Guassian Filter again to reduce noise and smoothen the image
    blur = cv2.GaussianBlur(edges, (5, 5), 0)
    ret, thresh = cv2.threshold(
        blur, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)  # Thresholding to convert the image into binary to use it further
    # setting up kernet 1x1 for the erosion and dilation operations
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (1, 1))
    # erosion to remove any small objects or noise that maybe in the image
    erosion = cv2.erode(thresh, kernel, iterations=1)
    contours, hierarchy = cv2.findContours(
        erosion, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)  # Using contour to detect the contours of the largest object in the image

    if len(contours) > 0:  # Checking if contours were found
        # Finding the contour with the largest Area
        c = max(contours, key=cv2.contourArea)
        # Using bounding box function and getting the dimensions for the bounding box around
        x, y, w, h = cv2.boundingRect(c)
        # the object (initial co-ordinates x,y and width and height)

        # Applying dilation with same kernel to restore the size and shape
        dilation = cv2.dilate(rgb, kernel, iterations=1)
        # Drawing the bounding box around the object
        cv2.rectangle(rgb, (x, y), (x+w, y+h), (0, 255, 0), 2)
        # Computing the width and length of the object in inches or centimeters, based on the dimensions of the bounding box
        # Assuming 1 pixel = 0.01 inches or 0.0254 centimeters
        width = w * 0.01
        length = h * 0.01
        # Outputing the results of the analysis, such as the dimensions of the object
        #  Writing the measurements on the image
        cv2.putText(rgb, "Width: {:.2f} inches".format(
            width), (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)  # Width
        cv2.putText(rgb, "Length: {:.2f} inches".format(
            length), (x, y+h+20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)  # Length
        gray_img = cv2.cvtColor(rgb, cv2.COLOR_BGR2RGBA)  # Correcting Color
        cv2.imwrite('public/uploads/output4.png', gray_img)  # Saving output
        return "output4.png"  # Sending file name
    else:
        return "No contours found in the image."  # No Contours were found in the image

# Image displaying Function


def show_image(imagePath):
    img = cv2.imread(imagePath)  # reading
    fig, axs = plt.subplots(1, 1)  # plotting
    axs.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))  # displaying
    axs.axis('off')
    axs.set_title('Original Image', fontsize='medium')  # window information
    plt.show()


# Driver
# image path getting from the api on server which is getting through my react app
imagePath = sys.argv[1]
processedImage = process_image(imagePath)  # calling processing function
path = r'public/uploads/' + processedImage  # setting path
show_image(path)  # calling display function
print(processedImage)  # sending file name
