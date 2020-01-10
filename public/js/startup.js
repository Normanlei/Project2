$(document).ready(function () {
    $(document).on("click", "#active", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
        $("#requestProject").hide();
        $("#findList").hide();
        $("#completeList").hide();
        $("#activeList").show();
    })
    $(document).on("click", "#find", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
        $("#requestProject").show();
        $("#findList").show();
        $("#completeList").hide();
        $("#activeList").hide();
    })
    $(document).on("click", "#complete", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
        $("#requestProject").hide();
        $("#findList").hide();
        $("#completeList").show();
        $("#activeList").hide();
    })

    // $(document).on("click", "#requestProject", function (event) {
    //     event.preventDefault();
    //     var projView = $("#project-display-section");
    //     projView.empty();
    //     var source = `<div class="container-fluid">
    //                     <div class="form-group row">
    //                         <label for="staticEmail" class="col-sm-4 col-form-label"><h5>Project Request Form</h5></label>
    //                     </div>
    //                     <div class="form-group input-icons">
    //                     <i class="fas fa-user icon"></i>
    //                         <input type="name" class="form-control input-field" id="title-input" placeholder="Title">
    //                     </div>
    //                     <div class="form-group input-icons">
    //                     <i class="fas fa-dollar-sign icon"></i>
    //                         <input type="price" class="form-control input-field" id="price-input"
    //                             placeholder="What is your budget?">
    //                     </div>
    //                     <div class="form-group">
    //                         <textarea type="email" class="form-control" id="description-input"
    //                             placeholder="Please describe your project..."></textarea>
    //                     </div>
    //                     <div class="form-group justify-content-center">
    //                         <button type="button" class="btn-grad" id="submitProject">Submit</button>
    //                     </div>
    //                 </div>`;
    //     var template = Handlebars.compile(source);
    //     projView.html(template({}));
    // });

    $(document).on("click", "#submitProject", function (event) {
        event.preventDefault();
        var title = $("#title-input").val().trim();
        var description = $("#description-input").val().trim();
        var price = $("#price-input").val().trim();
        var OrgId = $(this).data("id");
        var newProject = {
            title: title,
            description: description,
            price: price,
            OrgId: OrgId
        };
        $("#title-input").val("");
        $("#description-input").val("");
        $("#price-input").val("");
        $.post("/api/project", newProject)
            .then(function (data) {
                location.reload();
            });
    });

    $(document).on("click", ".project", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            console.log(project);
            var source = `<div class='project-content mt-3'>
                            <div class='project-title'>
                            <h3 class='info mb-3'>Project Information</h3>
                                <p class='bold'>TITLE</p>
                                <p>{{title}}</p>
                            </div>
                            <div class='project-description'>
                                <p class='bold'>DESCRIPTION</p>
                                <p>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <p class='bold'>BUDGET</p>
                                <p>$ {{price}}</p>
                            </div>
                            <div class='d-flex justify-content-center'>
                                <button data-id='{{id}}' class="btn-grad m-1 justify-content-center pickCandidate">Load Candidates</button>
                                <br>
                                <ul class="list-group" id="candidateList">
                                </ul>
                            </div>
                            <!--Modal-->
                            <div class="modal fade" id="appliedDevModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modal_developer_name"></h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <h3>Developer's Qualifications:</h3>
                                    <p id="modal_bid_content"></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button href="#" type="button" class="btn btn-primary" id = "modalProfileBtn">Profile Page</button>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });

    $(document).on("click", ".pickCandidate", function (event) {
        event.preventDefault();
        $("#candidateList").text("");
        var projectId = $(this).data("id");
        $.get(`/pick/${projectId}`, function (project) {
            var devList = project.developers_list;
            $.get("/api/users").then(function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (devList.includes(data[i].id.toString()) && !data[i].status) {
                            var obj = data[i];
                            obj.projId = projectId;
                            var currList = `<li class="applieddeveloper list-group-item d-flex justify-content-between align-items-center" data-id="${obj.id}" data-proj="${obj.projId}" data-name="${obj.first_name}"> ${obj.id}. ${obj.first_name} 
                <button class="pickFinalUser btn-grad" data-id="${obj.id}" data-proj="${obj.projId}">Pick!!!</button>
                </li>`;
                            $("#candidateList").append(currList);
                        }
                    }
                }
            });
        });
    });

    $(document).on("click", ".applieddeveloper", function (event) {
        event.preventDefault();
        var developer_name = $(this).data("name");
        var userId = $(this).data("id");
        var projId = $(this).data("proj");
        $("#modal_developer_name").html(developer_name);
        $.get(`/api/userbid/${userId}/${projId}`, function (data) {
            $("#modal_bid_content").html(data.bid_content);
            $("#modalProfileBtn").attr("data-id",userId);
            $("#appliedDevModal").modal();  //modal is not functionning here!!!!
        });
    });

    $(document).on("click", "#modalProfileBtn", function (event) {
        event.preventDefault();
        var userId = $(this).data("id");
        loadDevProfile(userId);
    });

    $(document).on("click", ".pickFinalUser", function (event) {
        event.stopPropagation();
        event.preventDefault();
        var userId = $(this).data("id");
        var projId = $(this).data("proj");
        $.ajax({
            url: `/proccess/${projId}/${userId}`,
            method: "PUT",
        }).then(function () {
            $.ajax({
                method: "PUT",
                url: `/update/user/${userId}/0`,
            }).then(function () {
                location.reload();
                // $.ajax({
                //     method: "PUT",
                //     url: `/recovers/${projId}/${userId}`
                // }).then(function () {

                // })
            })
        })
    });

    $(document).on("click", ".activeproject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            var source = `<div class='sticky-top' style='background: white;'>
                            <h6 class='ml16 col-sm-12 my-0 p-1' style='color: black;'>Project: {{title}}</h6>
                            <h6 class='ml16 col-sm-12 my-0 p-1' style='color: black;'>Price: {{price}}</h6>
                            <button type='submit' class='finishProject' data-id='{{id}}' data-uid="{{final_developer}}">Finish!!!</button>
                        </div>
                        <div class='project-content mt-3'>
                            <div class='project-title'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Title:</h6>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>{{title}}</h6>
                            </div>
                            <div class='project-description'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Description:</h6>
                                <p class='ml16 col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Budget:</h6>
                                <p>{{price}}</p>
                            </div>
                            <div>
                            <button data-id='{{id}}' data-uid="{{final_developer}}" class="viewFinalCandidate"> View Final Candidate</button>
                            <ul class="list-group finalCandidateList">

                            </ul>
                            </div>
                            <div class='form-group'>
                                <label for='exampleInputEmail1'>Coment:</label>
                                <textarea type='text' class='form-control' id='startup-comment'
                                    placeholder='How do you think about this developer's work on this project?'></textarea>
                            </div>
                            <div class="row">
                            <div id="msglog">
                            </div>
                            <textarea name="message" id="messageInput"></textarea>
                            <br />
                            Press Enter to Send!
                            </div>
                            <button type='submit' class='finishProject' data-id='{{id}}' data-uid="{{final_developer}}">Finish!!!</button>
                        </div>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
            loadSocket(projId);
        });
    });

    function loadSocket(projId) {
        var socket = io();
        // join
        socket.on('connect', function () {
            socket.emit('join', start_up_id, projId, start_up_name);
        });
        // send
        socket.on('msg', function (userName, msg, time) {
            var message = '' +
                '<div class="message">' +
                '  <span class="user">' + userName + ': </span>' +
                '  <span class="msg">' + msg + '</span>' +
                '</div>' +
                '<div class="sysMsg">' + time + '</div>';
            $('#msglog').append(message);
            $('#msglog').scrollTop($('#msglog')[0].scrollHeight);
        });

        //load previous history

        socket.on('history', function (history) {
            console.log(history);
            for (var i = 0; i < history.length; i++) {
                var message = '' +
                    '<div class="message">' +
                    '  <span class="user">' + history[i].userName + ': </span>' +
                    '  <span class="msg">' + history[i].message + '</span>' +
                    '</div>' +
                    '<div class="sysMsg">' + history[i].time + '</div>';
                $('#msglog').append(message);
                $('#msglog').scrollTop($('#msglog')[0].scrollHeight);
            }
        })

        // listen
        socket.on('sys', function (sysMsg) {
            var message = '<div class="sysMsg">' + sysMsg + '</div>';
            $('#msglog').append(message);

        });

        // message
        $('#messageInput').keydown(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                var msg = $(this).val();
                $(this).val('');

                socket.send(msg);
            }
        });
    }




    $(document).on("click", ".viewFinalCandidate", function (event) {
        event.preventDefault();
        $(".finalCandidateList").text("");
        var projectId = $(this).data("id");
        var developerId = $(this).data("uid");
        $.get(`/pick/user/${developerId}`).then(function (data) {
            var currList =
                `<li class="finaldeveloper list-group-item d-flex justify-content-between align-items-center" data-id="${data.id}">${data.id}. ${data.first_name}</li>`;
            $(".finalCandidateList").append(currList);
        });
    });

    $(document).on("click", ".finaldeveloper", function (event) {
        event.preventDefault();
        var userId = $(this).data("id");
        loadDevProfile(userId);
    });


    $(document).on("click", ".finishProject", function (event) {
        event.preventDefault();
        var comment = $("#startup-comment").val().trim();
        var projId = $(this).data("id");
        var userId = $(this).data("uid");
        $.ajax({
            method: "PUT",
            url: `/finishedproject/${projId}`,
        }).then(function () {
            if (userId !== -1) {
                $.ajax({
                    method: "PUT",
                    url: `/update/user/${userId}/1`,
                }).then(function () {
                    location.reload();
                })
            } else location.reload();
        })
    });


    $(document).on("click", ".completeproject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();
        $.get("/pick/" + projId).then(function (project) {
            var source = `<div class='project-content mt-3'>
                            <div class='project-title'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Title:</h6>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>{{title}}</h6>
                            </div>
                            <div class='project-description'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Description:</h6>
                                <p class='ml16 col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Budget:</h6>
                                <p>{{price}}</p>
                            </div>
                            <div>
                            <button data-id='{{id}}' data-uid="{{final_developer}}" class="viewFinalCandidate"> View Final Candidate</button>
                            <ul class="list-group finalCandidateList">
                            </ul>
                            </div>`;

            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });

    loadStartupNProject();
    var start_up_name;
    var start_up_id;
    function loadStartupNProject() {
        var bigData = {
            startup_name: "",
            startup_email: "",
            startup_intro: "",
            project: [],
            activeProject: [],
            completeProject: [],
        };
        $.get("/api/org_data").then(function (data) {
            start_up_name = data.name;
            start_up_id = data.id;
            bigData.startup_name = data.name;
            bigData.startup_email = data.email;
            bigData.startup_intro = data.intro;
            loadAllProj();
        });

        function loadAllProj() {
            $.get("/api/project").then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status === "Hiring") {
                        bigData.project.push(data[i]);
                    } else if (data[i].status === "Proccessing") {
                        bigData.activeProject.push(data[i]);
                    } else {
                        bigData.completeProject.push(data[i]);
                    }
                }
                console.log(bigData);
                var source = `<div class="row">
                                <div class="col profile" id="profileView">
                                    <div class="name">
                                    <h1 class="cursive">Hello.</h1>
                                <p class="p-0 m-0"><i class="fas fa-user icon"></i>{{startup_name}}</p>
                                    </div>
                                    <p class="p-0 m-0"><i class="fas fa-at icon"></i>{{startup_email}}</p>
                                    <p class="p-0 m-0"><i class="fas fa-quote-left icon"></i> {{startup_intro}} <i class="fas fa-quote-right icon"></i></p>
                                    
                                </div>
                            </div>
                                <div class="row" id="startupWindows">
                                    <div class="col-sm-3" id="projDisp">
                                            <div class="btn-group justify-content-center" role="group" aria-label="Basic example">
                                                <button type="button" class="btn-proj" id="find" data-toggle="tooltip" data-placement="top" title="Available Projects"><i class="fas fa-file-alt iconB"></i></button>
                                                <button type="button" class="btn-proj" id="active" data-toggle="tooltip" data-placement="top" title="Projects in Progress"><i class="fas fa-spinner iconB"></i></button>
                                                <button type="button" class="btn-proj" id="complete" data-toggle="tooltip" data-placement="top" title="Completed Projects"><i class="fas fa-check iconB"></i></button>
                                            </div>
                                            <div class="col-sm-12 overflow-auto" id="projView">
                                                <ul id="findList">
                                                    {{#each project}}
                                                    <li class="project" data-id="{{id}}">
                                                        <hi> {{title}} </hi>
                                                        <p> $ {{price}} </p>
                                                    </li>
                                                    {{/each}}
                                                </ul>
                                                <ul id="activeList" style="display: none">
                                                    {{#each activeProject}}
                                                    <li class="activeproject" data-id="{{id}}">
                                                        <hi> {{title}} </hi>
                                                        <p> {{price}} </p>
                                                    </li>
                                                    {{/each}}
                                                </ul>
                                                <ul id="completeList" style="display: none">
                                                    {{#each completeProject}}
                                                    <li class="completeproject" data-id="{{id}}">
                                                        <hi> {{title}} </hi>
                                                        <p> {{price}} </p>
                                                    </li>
                                                    {{/each}}
                                                </ul>
                                            </div>
                                    </div>
                                    <div class="col-sm-9" id="project-display-section">
                                    </div>
                                </div>
                            </div>
                            `;
                var template = Handlebars.compile(source);
                $(".container-fluid").html(template(bigData));
            });
        }
    }


    function loadDevProfile(userId) {
        console.log("test");
        var bigData = {
            developer_name: "",
            developer_email: "",
            developer_staus: "",
            developer_intro: "",
            developer_techniques: [],
            completeProjects: [],
        };
        $.get(`/pick/user/${userId}`)
            .then(function (user) {
                bigData.developer_name = user.first_name;
                bigData.developer_email = user.email;
                bigData.developer_staus = user.status;
                bigData.developer_intro = user.intro;
                var techString = user.techniques;
                var techArray = techString.split(";");
                bigData.developer_techniques = techArray;
                $.get("/api/project").then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].status === "Finished" && data[i].final_developer == userId) {
                            bigData.completeProjects.push(data[i]);
                        }
                    }
                    console.log(bigData);
                    $.post('/dev-profile',bigData).then(function(){
                        $.get('/dev-profile-page').then(function(){
                            window.open('/dev-profile-page','_blank');
                        })
                    })
                });
            });
    }
});
